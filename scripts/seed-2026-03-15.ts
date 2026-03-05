/**
 * Seed mass program for Laetare Sunday, 15 March 2026.
 * Usage: npx tsx scripts/seed-2026-03-15.ts
 */

import { createClient } from "@libsql/client";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../db/schema";

const DB_URL = process.env.DATABASE_URL ?? "file:./data/local.db";
const DB_TOKEN = process.env.DATABASE_AUTH_TOKEN;

async function main() {
  const client = createClient({ url: DB_URL, authToken: DB_TOKEN });
  const db = drizzle(client, { schema });

  // ── Helper: find or create hymn ──────────────────────────────────
  async function findOrCreateHymn(
    title: string,
    extra?: Partial<typeof schema.hymns.$inferInsert>,
  ) {
    const existing = await db.query.hymns.findFirst({
      where: eq(schema.hymns.title, title),
    });
    if (existing) {
      console.log(`  Found: "${title}" (id=${existing.id})`);
      return existing.id;
    }
    const [row] = await db
      .insert(schema.hymns)
      .values({ title, ...extra })
      .returning({ id: schema.hymns.id });
    console.log(`  Created: "${title}" (id=${row.id})`);
    return row.id;
  }

  async function addVerses(
    hymnId: number,
    verses: {
      num: number;
      text: string;
      isChorus?: boolean;
      language?: string;
    }[],
  ) {
    for (const v of verses) {
      await db
        .insert(schema.hymnVerses)
        .values({
          hymnId,
          verseNumber: v.num,
          verseText: v.text,
          isChorus: v.isChorus ?? false,
          language: v.language ?? "en",
        })
        .onConflictDoNothing();
    }
  }

  async function addTags(hymnId: number, tags: string[]) {
    for (const tag of tags) {
      await db
        .insert(schema.hymnTags)
        .values({ hymnId, tag })
        .onConflictDoNothing();
    }
  }

  // ── 1. Create hymns ──────────────────────────────────────────────
  console.log("Creating hymns...");

  // Attende Domine
  const attendeId = await findOrCreateHymn("Attende Domine", {
    tradition: "gregorian",
    language: "la",
  });
  await addTags(attendeId, ["lenten"]);
  await addVerses(attendeId, [
    {
      num: 0,
      text: "Attende Domine, et miserere, quia peccavimus tibi",
      isChorus: true,
      language: "la",
    },
    {
      num: 0,
      text: "Look down, O Lord, and have mercy, for we have sinned against thee.",
      isChorus: true,
      language: "en",
    },
    {
      num: 1,
      text: "Ad te Rex summe, omnium redemptor, oculos nostros sublevamus flente, exaudi Christe, supplicantum preces.",
      language: "la",
    },
    {
      num: 1,
      text: "To thee, high King, Redeemer of all, weeping we lift our eyes, hear O Christ, the prayers of thy servants.",
      language: "en",
    },
    {
      num: 2,
      text: "Dextera Patris, lapis angularis, via salutis janua caelestis, ablue nostri maculas delicti.",
      language: "la",
    },
    {
      num: 2,
      text: "Right hand of the Father, cornerstone, path of salvation and gate of heaven, cleanse the stains of our sins.",
      language: "en",
    },
    {
      num: 3,
      text: "Rogamus Deus, tuam majestatem, auribus sacris gemitus exaudi, crimina nostra placidus indulge.",
      language: "la",
    },
    {
      num: 3,
      text: "O God, we pray thy majesty, lend thy holy ears to our sighs, mercifully forgive our offenses.",
      language: "en",
    },
    {
      num: 4,
      text: "Tibi fatemur crimina admissa, contrito corde pandimus occulta, tua Redemptor, pieta ignoscat.",
      language: "la",
    },
    {
      num: 4,
      text: "To thee we confess committed sin, with contrite heart we unveil hidden faults, may thy mercy, Redeemer, forgive.",
      language: "en",
    },
    {
      num: 5,
      text: "Innocens captus, nec repugnans ductus, testibus falsis pro impiis damnatus, quos redemisti tu conserva, Christe.",
      language: "la",
    },
    {
      num: 5,
      text: "Seized though innocent, led away unresisting, condemned by false witness in place of the guilty, keep O Christ, those whom thou hast redeemed.",
      language: "en",
    },
  ]);

  // Kyrie (Russian)
  const kyrieRussianId = await findOrCreateHymn("Kyrie (Russian)", {
    tradition: "classical",
    language: "el",
  });
  await addTags(kyrieRussianId, ["kyrie"]);
  await addVerses(kyrieRussianId, [
    { num: 1, text: "Kyrie Eleison\nKyrie Eleison\nKyrie Eleison" },
    { num: 2, text: "Christe Eleison\nChriste Eleison\nChriste Eleison" },
    { num: 3, text: "Kyrie Eleison\nKyrie Eleison\nKyrie Eleison" },
  ]);

  // Gospel Acclamation (Mass of Creation)
  const gospelAccId = await findOrCreateHymn(
    "Gospel Acclamation (Mass of Creation)",
    {
      composer: "Marty Haugen",
      tradition: "contemporary",
      language: "en",
    },
  );
  await addTags(gospelAccId, ["alleluia"]);
  await addVerses(gospelAccId, [
    {
      num: 0,
      text: "Praise to You,\nLord Jesus Christ,\nKing of endless glory.",
      isChorus: true,
    },
  ]);

  // Sanctus - Jernberg
  const sanctusJernbergId = await findOrCreateHymn("Sanctus (Jernberg)", {
    composer: "Jernberg",
    tradition: "classical",
  });
  await addTags(sanctusJernbergId, ["sanctus"]);

  // Mysterium Fidei - Mass of Creation
  const mystFideiId = await findOrCreateHymn(
    "We Proclaim Your Death, O Lord (Mass of Creation)",
    {
      composer: "Marty Haugen",
      tradition: "contemporary",
    },
  );
  await addTags(mystFideiId, ["mysterium-fidei"]);

  // Agnus Dei - Welsh Mass
  const agnusWelshId = await findOrCreateHymn("Agnus Dei (Welsh Mass)", {
    tradition: "classical",
  });
  await addTags(agnusWelshId, ["agnus-dei"]);

  // Great Amen - Jernberg
  const amenJernbergId = await findOrCreateHymn(
    "Great Amen (Jernberg / Mass of St. Philip Neri)",
    {
      composer: "Jernberg",
      tradition: "classical",
    },
  );

  // Jesus Remember Me
  const jesusRememberId = await findOrCreateHymn("Jesus Remember Me", {
    composer: "Taizé",
    tradition: "contemporary",
  });
  await addTags(jesusRememberId, ["communion", "lenten"]);

  // The Lord is my Shepherd - Heather Sorenson
  const shepherdId = await findOrCreateHymn("The Lord is my Shepherd", {
    composer: "Heather Sorenson",
    tradition: "contemporary",
    language: "en",
  });
  await addTags(shepherdId, ["communion"]);
  await addVerses(shepherdId, [
    {
      num: 1,
      text: "The Lord is my Shepherd\nAnd I shall not want\nI shall not want\nI shall not want\nThe Lord is my Shepherd\nAnd I shall not want\nI shall not want for more\nHow could I ask for more?",
    },
    {
      num: 2,
      text: "He leads by still water\nAnd I shall not want\nI shall not want\nI shall not want\nHe leads by still water\nAnd I shall not want\nI shall not want for more\nHow could I ask for more?",
    },
    {
      num: 0,
      text: "He is enough for ev'ry need\nHe is enough for ev'ry broken dream\nThe Lord is my Shepherd\nI shall not want\nI'm satisfied with what He gives\nHe will provide and faithfully supply\nThe Lord is my Shepherd\nAnd I shall not want",
      isChorus: true,
    },
    {
      num: 3,
      text: "He leads through the valley\nAnd I shall not want\nI shall not want\nI shall not want\nHe leads through the valley\nAnd I shall not want\nAnd I shall not want",
    },
    {
      num: 4,
      text: "He is the Night, He is the Day\nHe is the Sun, He is the Shade\nHe is the Ocean, He's the Stream\nIn ev'ry song, He is my theme\nAnd if we wander off alone\nHis mercy calls us back to home\nHis mercy calls us back to home\nBack to home!",
    },
    {
      num: 5,
      text: "I feast at His table\nAnd I shall not want\nI shall not want\nI shall not want\nI feast at His table\nAnd I shall not want\nI shall not want for more\nHe is the Strength to conquer sin\nI shall not want for more\nHe's faithful when my trust is thin\nI shall not want",
    },
  ]);

  // Himno a San Jose
  const himnoId = await findOrCreateHymn("Himno a San José", {
    language: "es",
  });
  await addTags(himnoId, ["recessional"]);

  // Indodana
  const indodanaId = await findOrCreateHymn("Indodana", {
    tradition: "african",
  });

  // God of Mercy and Compassion already exists (id=82)
  const godOfMercyId = 82;

  // ── 2. Create mass program ───────────────────────────────────────
  console.log("\nCreating mass program...");

  // Delete existing if re-running
  const existing = await db.query.massPrograms.findFirst({
    where: eq(schema.massPrograms.date, "2026-03-15"),
  });
  if (existing) {
    await db
      .delete(schema.massProgramSongs)
      .where(eq(schema.massProgramSongs.massProgramId, existing.id));
    await db
      .delete(schema.massPrograms)
      .where(eq(schema.massPrograms.id, existing.id));
    console.log("  Deleted existing program for 2026-03-15");
  }

  const [prog] = await db
    .insert(schema.massPrograms)
    .values({
      date: "2026-03-15",
      title: "Laetare Sunday — 4th Sunday of Lent (Year A)",
    })
    .returning({ id: schema.massPrograms.id });

  const songs: { hymnId: number; section: string; order: number }[] = [
    { hymnId: attendeId, section: "prelude", order: 0 },
    { hymnId: kyrieRussianId, section: "kyrie", order: 0 },
    { hymnId: gospelAccId, section: "alleluia", order: 0 },
    { hymnId: godOfMercyId, section: "offertory", order: 0 },
    { hymnId: sanctusJernbergId, section: "sanctus", order: 0 },
    { hymnId: mystFideiId, section: "mysterium-fidei", order: 0 },
    { hymnId: agnusWelshId, section: "agnus-dei", order: 0 },
    { hymnId: amenJernbergId, section: "amen", order: 0 },
    { hymnId: jesusRememberId, section: "communion", order: 0 },
    { hymnId: shepherdId, section: "communion", order: 1 },
    { hymnId: himnoId, section: "recessional", order: 0 },
    { hymnId: indodanaId, section: "reprise", order: 0 },
  ];

  for (const s of songs) {
    await db.insert(schema.massProgramSongs).values({
      massProgramId: prog.id,
      hymnId: s.hymnId,
      massSection: s.section,
      sortOrder: s.order,
    });
  }

  // Add responsorial psalm as lyrics override (not a hymn in our DB)
  await db.insert(schema.massProgramSongs).values({
    massProgramId: prog.id,
    hymnId: shepherdId, // placeholder link
    massSection: "responsorial",
    sortOrder: 0,
    lyricsOverride: `Psalm 23: 1-3a, 3b-4, 5, 6
R. (1) The Lord is my shepherd; there is nothing I shall want.

The LORD is my shepherd; I shall not want.
    In verdant pastures he gives me repose;
beside restful waters he leads me;
    he refreshes my soul.
R. The Lord is my shepherd; there is nothing I shall want.

He guides me in right paths
    for his name's sake.
Even though I walk in the dark valley
    I fear no evil; for you are at my side
With your rod and your staff
    that give me courage.
R. The Lord is my shepherd; there is nothing I shall want.

You spread the table before me
    in the sight of my foes;
you anoint my head with oil;
    my cup overflows.
R. The Lord is my shepherd; there is nothing I shall want.

Only goodness and kindness follow me
    all the days of my life;
and I shall dwell in the house of the LORD
    for years to come.
R. The Lord is my shepherd; there is nothing I shall want.`,
  });

  console.log(
    `  Program created (id=${prog.id}) with ${songs.length + 1} songs`,
  );
  console.log("\nDone!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
