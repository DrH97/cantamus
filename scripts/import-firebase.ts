/**
 * Import Firebase export JSON into the local SQLite database.
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

// ── Category mapping ────────────────────────────────────────────────
const PACK_NAME_TO_CATEGORY: Record<
  string,
  { name: string; type: string; sortOrder: number }
> = {
  "Entrance Hymns": { name: "introit", type: "mass_section", sortOrder: 1 },
  "Offertory Hymns": { name: "offertory", type: "mass_section", sortOrder: 2 },
  "Proclamations Of Faith": {
    name: "mysterium-fidei",
    type: "mass_section",
    sortOrder: 3,
  },
  "Sign Of Peace": { name: "sign-of-peace", type: "pack", sortOrder: 4 },
  "Communion Hymns": { name: "communion", type: "mass_section", sortOrder: 5 },
  "Exit Hymns": { name: "recessional", type: "mass_section", sortOrder: 6 },
  "Marian Hymns": { name: "marian", type: "pack", sortOrder: 7 },
  "Thanksgiving Hymns": {
    name: "thanksgiving",
    type: "pack",
    sortOrder: 8,
  },
  "Advent Hymns": { name: "advent", type: "liturgical_season", sortOrder: 9 },
  "Christmas Carols": {
    name: "christmas",
    type: "liturgical_season",
    sortOrder: 10,
  },
  "Lenten Hymns": { name: "lenten", type: "liturgical_season", sortOrder: 11 },
  "Easter Hymns": { name: "easter", type: "liturgical_season", sortOrder: 12 },
  "Holy Spirit Hymns": {
    name: "holy-spirit",
    type: "pack",
    sortOrder: 13,
  },
  "Latin Hymns": { name: "latin", type: "pack", sortOrder: 14 },
  "General Hymns": { name: "general", type: "pack", sortOrder: 15 },
};

// "Sung Masses" pack gets split by title keywords into mass sections
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

// ── Helpers ─────────────────────────────────────────────────────────
function generateId(): string {
  return crypto.randomUUID();
}

/** Normalise inconsistent Firebase date strings to YYYY-MM-DD */
function normaliseDate(raw: string): string {
  // Try "Jan 23, 2026" or "2 Apr 2024" or "25 Dec 2020"
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
  await db.delete(schema.hymnCategories);
  await db.delete(schema.hymnVerses);
  await db.delete(schema.categories);
  await db.delete(schema.hymns);

  // ── 1. Categories ──────────────────────────────────────────────
  console.log("Importing categories…");
  const categoryRows: (typeof schema.categories.$inferInsert)[] = [];
  const firebasePackIdToCategory = new Map<
    string,
    { id: string; name: string; type: string }
  >();

  // Sung Masses sub-categories
  const sungMassCategories = new Map<string, string>();
  for (const [_kw, section] of SUNG_MASS_KEYWORDS) {
    const catId = generateId();
    categoryRows.push({
      id: catId,
      name: section,
      type: "mass_section",
      sortOrder: categoryRows.length,
    });
    sungMassCategories.set(section, catId);
  }

  const hymnPacks = data.hymn_packs as Record<
    string,
    { packName: string; packSize: number }
  >;
  const sungMassesPackId = Object.entries(hymnPacks).find(
    ([, v]) => v.packName === "Sung Masses",
  )?.[0];

  for (const [fbPackId, pack] of Object.entries(hymnPacks)) {
    if (pack.packName === "Sung Masses") continue; // handled above

    const mapping = PACK_NAME_TO_CATEGORY[pack.packName];
    if (!mapping) {
      console.warn(`  Unknown pack: ${pack.packName}, skipping`);
      continue;
    }

    const catId = generateId();
    categoryRows.push({
      id: catId,
      name: mapping.name,
      type: mapping.type,
      sortOrder: mapping.sortOrder,
    });
    firebasePackIdToCategory.set(fbPackId, {
      id: catId,
      name: mapping.name,
      type: mapping.type,
    });
  }

  if (categoryRows.length > 0) {
    await db.insert(schema.categories).values(categoryRows);
  }
  console.log(`  ${categoryRows.length} categories inserted`);

  // ── 2. Hymns + category links ──────────────────────────────────
  console.log("Importing hymns…");

  const searchRedundancy = data.searchRedundancy as Record<
    string,
    Record<string, unknown>
  >;
  const packsAndTitles = data.packsAndTitles as Record<
    string,
    Record<
      string,
      { title: string; hymnal?: string; hymnNumber?: string; hymnPage?: string }
    >
  >;

  // Build hymn→packs reverse map
  const hymnToPackIds = new Map<string, string[]>();
  for (const [packId, hymns] of Object.entries(packsAndTitles)) {
    for (const hymnId of Object.keys(hymns)) {
      const existing = hymnToPackIds.get(hymnId) ?? [];
      existing.push(packId);
      hymnToPackIds.set(hymnId, existing);
    }
  }

  const hymnRows: (typeof schema.hymns.$inferInsert)[] = [];
  const hymnCatRows: (typeof schema.hymnCategories.$inferInsert)[] = [];
  const seenHymnIds = new Set<string>();

  for (const [hymnId, sr] of Object.entries(searchRedundancy)) {
    if (seenHymnIds.has(hymnId)) continue;

    const title = sr.title as string | undefined;
    if (!title) {
      console.warn(`  Skipping hymn ${hymnId} — no title`);
      continue;
    }
    seenHymnIds.add(hymnId);
    const hymnal = (sr.hymnal as string) || undefined;
    const hymnNumber = (sr.hymnNumber as string) || undefined;
    const hymnPage = (sr.hymnPage as string) || undefined;

    hymnRows.push({
      id: hymnId,
      title,
      hymnal: hymnal ?? null,
      hymnNumber: hymnNumber ?? null,
      hymnPage: hymnPage ?? null,
      isFavourite: false,
      isWedding: false,
    });

    // Link to categories
    const packIds = hymnToPackIds.get(hymnId) ?? [];
    for (const packId of packIds) {
      if (packId === sungMassesPackId) {
        // Split Sung Masses by keyword
        const titleLower = title.toLowerCase();
        let matched = false;
        for (const [keyword, section] of SUNG_MASS_KEYWORDS) {
          if (titleLower.includes(keyword)) {
            const catId = sungMassCategories.get(section);
            if (catId) {
              hymnCatRows.push({ hymnId, categoryId: catId });
              matched = true;
            }
          }
        }
        // If no keyword matched, skip (these are full mass settings)
        if (!matched) {
          // Default: link to kyrie since sung masses include kyrie
          const catId = sungMassCategories.get("kyrie");
          if (catId) {
            hymnCatRows.push({ hymnId, categoryId: catId });
          }
        }
      } else {
        const cat = firebasePackIdToCategory.get(packId);
        if (cat) {
          hymnCatRows.push({ hymnId, categoryId: cat.id });
        }
      }
    }
  }

  // Batch insert hymns
  const BATCH = 100;
  for (let i = 0; i < hymnRows.length; i += BATCH) {
    await db.insert(schema.hymns).values(hymnRows.slice(i, i + BATCH));
  }
  console.log(`  ${hymnRows.length} hymns inserted`);

  // Batch insert hymn-category links
  for (let i = 0; i < hymnCatRows.length; i += BATCH) {
    await db
      .insert(schema.hymnCategories)
      .values(hymnCatRows.slice(i, i + BATCH));
  }
  console.log(`  ${hymnCatRows.length} hymn-category links inserted`);

  // ── 3. Verses ──────────────────────────────────────────────────
  console.log("Importing verses…");
  const titlesAndVerses = data.titlesAndVerses as Record<
    string,
    Record<string, { verseText: string; chorus?: boolean }>
  >;

  const verseRows: (typeof schema.hymnVerses.$inferInsert)[] = [];
  for (const [hymnId, verses] of Object.entries(titlesAndVerses)) {
    if (!seenHymnIds.has(hymnId)) continue;

    let verseNum = 0;
    for (const [verseId, verse] of Object.entries(verses)) {
      if (!verseId.startsWith("-")) continue; // skip non-verse keys
      verseNum++;
      verseRows.push({
        id: verseId,
        hymnId,
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

  // ── 4. Mass Programs ───────────────────────────────────────────
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
        hymnal?: string;
        hymnNumber?: string;
        hymnPage?: string;
      }
    >
  >;

  let programCount = 0;
  let songCount = 0;

  for (const [rawDate, songs] of Object.entries(massHymns)) {
    const date = normaliseDate(rawDate);
    const progId = generateId();

    await db.insert(schema.massPrograms).values({
      id: progId,
      date,
      title: null,
    });
    programCount++;

    const songEntries = Object.entries(songs).sort(
      ([, a], [, b]) => (a.index ?? 0) - (b.index ?? 0),
    );

    for (const [fbSongId, song] of songEntries) {
      const hymnId = song.hymnId ?? fbSongId;
      const massSection = MASS_TYPE_MAP[song.type] ?? "introit";

      // Only insert if the hymn exists in our DB
      if (!seenHymnIds.has(hymnId)) {
        console.warn(
          `  Skipping mass song ${song.title} — hymn ${hymnId} not in DB`,
        );
        continue;
      }

      await db.insert(schema.massProgramSongs).values({
        id: generateId(),
        massProgramId: progId,
        hymnId,
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
