/**
 * Import Firebase export JSON into the local SQLite database.
 *
 * Uses integer autoincrement PKs and hymn_tags join table.
 * Skips blue hymnal songs.
 *
 * Usage: pnpm db:import
 */

import { readFileSync } from "node:fs";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../db/schema";

const FIREBASE_PATH = "/home/jack/Downloads/succ-3d591-export.json";
const DB_URL = process.env.DATABASE_URL ?? "file:./data/local.db";
const DB_TOKEN = process.env.DATABASE_AUTH_TOKEN;

// ── Pack name → tag name mapping ────────────────────────────────────
const PACK_NAME_TO_TAG: Record<string, string> = {
  "Entrance Hymns": "introit",
  "Offertory Hymns": "offertory",
  "Proclamations Of Faith": "mysterium-fidei",
  "Sign Of Peace": "sign-of-peace",
  "Communion Hymns": "communion",
  "Exit Hymns": "recessional",
  "Marian Hymns": "marian",
  "Thanksgiving Hymns": "thanksgiving",
  "Advent Hymns": "advent",
  "Christmas Carols": "christmas",
  "Lenten Hymns": "lenten",
  "Easter Hymns": "easter",
  "Holy Spirit Hymns": "holy-spirit",
  "Latin Hymns": "latin",
  "General Hymns": "general",
};

// "Sung Masses" pack gets split by title keywords into tags
const SUNG_MASS_KEYWORDS: [string, string][] = [
  ["kyrie", "kyrie"],
  ["gloria", "gloria"],
  ["sanctus", "sanctus"],
  ["agnus", "agnus-dei"],
];

// Mass type (from Firebase MassHymns) → mass_section
const MASS_TYPE_MAP: Record<string, string> = {
  Entrance: "introit",
  "Kyrie and Gloria": "kyrie",
  "Gospel Procession": "alleluia",
  Offertory: "offertory",
  Communion: "communion",
  Exit: "recessional",
};

/** Normalise inconsistent Firebase date strings to YYYY-MM-DD */
function normaliseDate(raw: string): string {
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// ── Main ────────────────────────────────────────────────────────────
async function main() {
  console.log("Reading Firebase export…");
  const raw = readFileSync(FIREBASE_PATH, "utf-8");
  const data = JSON.parse(raw);

  const client = createClient({ url: DB_URL, authToken: DB_TOKEN });
  const db = drizzle(client, { schema });

  // Clear existing data (idempotent re-runs)
  console.log("Clearing existing data…");
  await db.delete(schema.massProgramSongs);
  await db.delete(schema.massPrograms);
  await db.delete(schema.hymnTags);
  await db.delete(schema.hymnVerses);
  await db.delete(schema.hymns);

  // ── 1. Build pack→tag mapping ────────────────────────────────────
  const hymnPacks = data.hymn_packs as Record<
    string,
    { packName: string; packSize: number }
  >;
  const sungMassesPackId = Object.entries(hymnPacks).find(
    ([, v]) => v.packName === "Sung Masses",
  )?.[0];

  const firebasePackIdToTag = new Map<string, string>();
  for (const [fbPackId, pack] of Object.entries(hymnPacks)) {
    if (pack.packName === "Sung Masses") continue;
    const tag = PACK_NAME_TO_TAG[pack.packName];
    if (!tag) {
      console.warn(`  Unknown pack: ${pack.packName}, skipping`);
      continue;
    }
    firebasePackIdToTag.set(fbPackId, tag);
  }

  // ── 2. Build hymn→packs reverse map ──────────────────────────────
  const packsAndTitles = data.packsAndTitles as Record<
    string,
    Record<
      string,
      { title: string; hymnal?: string; hymnNumber?: string; hymnPage?: string }
    >
  >;

  const hymnToPackIds = new Map<string, string[]>();
  for (const [packId, hymns] of Object.entries(packsAndTitles)) {
    for (const hymnId of Object.keys(hymns)) {
      const existing = hymnToPackIds.get(hymnId) ?? [];
      existing.push(packId);
      hymnToPackIds.set(hymnId, existing);
    }
  }

  // ── 3. Import hymns ──────────────────────────────────────────────
  console.log("Importing hymns…");

  const searchRedundancy = data.searchRedundancy as Record<
    string,
    Record<string, unknown>
  >;

  // Map from Firebase hymn ID → new integer ID
  const fbIdToNewId = new Map<string, number>();
  const seenFbIds = new Set<string>();
  let blueSkipped = 0;

  // Collect hymn data with their tags
  const hymnInserts: {
    title: string;
    hymnal: string | null;
    tags: string[];
  }[] = [];
  const fbIdOrder: string[] = [];

  for (const [hymnId, sr] of Object.entries(searchRedundancy)) {
    if (seenFbIds.has(hymnId)) continue;

    const title = sr.title as string | undefined;
    if (!title) {
      console.warn(`  Skipping hymn ${hymnId} — no title`);
      continue;
    }

    const hymnal = (sr.hymnal as string) || null;

    if (hymnal && hymnal.toLowerCase().includes("blue")) {
      blueSkipped++;
      continue;
    }

    seenFbIds.add(hymnId);

    // Build tags from pack membership
    const tags: string[] = [];
    const packIds = hymnToPackIds.get(hymnId) ?? [];
    for (const packId of packIds) {
      if (packId === sungMassesPackId) {
        const titleLower = title.toLowerCase();
        let matched = false;
        for (const [keyword, section] of SUNG_MASS_KEYWORDS) {
          if (titleLower.includes(keyword)) {
            if (!tags.includes(section)) tags.push(section);
            matched = true;
          }
        }
        if (!matched) {
          if (!tags.includes("kyrie")) tags.push("kyrie");
        }
      } else {
        const tag = firebasePackIdToTag.get(packId);
        if (tag && !tags.includes(tag)) tags.push(tag);
      }
    }

    hymnInserts.push({ title, hymnal, tags });
    fbIdOrder.push(hymnId);
  }

  // Batch insert hymns and get back integer IDs
  const BATCH = 100;
  for (let i = 0; i < hymnInserts.length; i += BATCH) {
    const batch = hymnInserts.slice(i, i + BATCH);
    const rows = await db
      .insert(schema.hymns)
      .values(batch.map((h) => ({ title: h.title, hymnal: h.hymnal })))
      .returning({ id: schema.hymns.id });

    for (let j = 0; j < rows.length; j++) {
      fbIdToNewId.set(fbIdOrder[i + j], rows[j].id);
    }
  }
  console.log(`  ${hymnInserts.length} hymns inserted`);
  console.log(`  ${blueSkipped} blue hymnal hymns skipped`);

  // ── 4. Insert tags ───────────────────────────────────────────────
  console.log("Importing tags…");
  const tagRows: { hymnId: number; tag: string }[] = [];
  for (let i = 0; i < hymnInserts.length; i++) {
    const newId = fbIdToNewId.get(fbIdOrder[i]);
    if (!newId) continue;
    for (const tag of hymnInserts[i].tags) {
      tagRows.push({ hymnId: newId, tag });
    }
  }

  for (let i = 0; i < tagRows.length; i += BATCH) {
    await db.insert(schema.hymnTags).values(tagRows.slice(i, i + BATCH));
  }
  console.log(`  ${tagRows.length} tags inserted`);

  // ── 5. Verses ────────────────────────────────────────────────────
  console.log("Importing verses…");
  const titlesAndVerses = data.titlesAndVerses as Record<
    string,
    Record<string, { verseText: string; chorus?: boolean }>
  >;

  const verseRows: (typeof schema.hymnVerses.$inferInsert)[] = [];
  for (const [fbHymnId, verses] of Object.entries(titlesAndVerses)) {
    const newId = fbIdToNewId.get(fbHymnId);
    if (!newId) continue;

    let verseNum = 0;
    for (const [verseId, verse] of Object.entries(verses)) {
      if (!verseId.startsWith("-")) continue;
      verseNum++;
      verseRows.push({
        hymnId: newId,
        verseNumber: verseNum,
        verseText: verse.verseText ?? "",
        isChorus: verse.chorus === true,
      });
    }
  }

  for (let i = 0; i < verseRows.length; i += BATCH) {
    await db.insert(schema.hymnVerses).values(verseRows.slice(i, i + BATCH));
  }
  console.log(`  ${verseRows.length} verses inserted`);

  // ── 6. Mass Programs ─────────────────────────────────────────────
  console.log("Importing mass programs…");
  const massHymns = data.MassHymns as Record<
    string,
    Record<
      string,
      {
        hymnId?: string;
        title: string;
        type: string;
        index: number;
      }
    >
  >;

  let programCount = 0;
  let songCount = 0;

  for (const [rawDate, songs] of Object.entries(massHymns)) {
    const date = normaliseDate(rawDate);

    const [prog] = await db
      .insert(schema.massPrograms)
      .values({ date, title: null })
      .returning({ id: schema.massPrograms.id });
    programCount++;

    const songEntries = Object.entries(songs).sort(
      ([, a], [, b]) => (a.index ?? 0) - (b.index ?? 0),
    );

    for (const [fbSongId, song] of songEntries) {
      const fbHymnId = song.hymnId ?? fbSongId;
      const newHymnId = fbIdToNewId.get(fbHymnId);
      const massSection = MASS_TYPE_MAP[song.type] ?? "introit";

      if (!newHymnId) {
        console.warn(
          `  Skipping mass song ${song.title} — hymn ${fbHymnId} not in DB`,
        );
        continue;
      }

      await db.insert(schema.massProgramSongs).values({
        massProgramId: prog.id,
        hymnId: newHymnId,
        massSection,
        sortOrder: song.index ?? 0,
      });
      songCount++;
    }
  }
  console.log(`  ${programCount} mass programs inserted`);
  console.log(`  ${songCount} mass program songs inserted`);

  console.log("\nImport complete!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Import failed:", err);
  process.exit(1);
});
