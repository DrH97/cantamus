/**
 * Seed all Cantamus artists (singers & instrumentalists).
 * Usage: pnpm tsx scripts/seed-artists.ts
 */

import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../db/schema";

const DB_URL = process.env.DATABASE_URL ?? "file:./data/local.db";
const DB_TOKEN = process.env.DATABASE_AUTH_TOKEN;

const members: {
  name: string;
  voicePart: string;
  instrument?: string;
  isConductor?: boolean;
  isCORMember?: boolean;
}[] = [
  // Sopranos
  { name: "Faith Kisio", voicePart: "soprano" },
  { name: "Nyandia Maina", voicePart: "soprano" },
  { name: "Kathleen Jean-Pierre", voicePart: "soprano" },
  { name: "Tania", voicePart: "soprano" },
  { name: "Terry", voicePart: "soprano" },
  { name: "Laura", voicePart: "soprano" },
  { name: "Marion Kimathi", voicePart: "soprano" },
  { name: "Brittany Mungara", voicePart: "soprano" },
  { name: "Bernadine", voicePart: "soprano" },

  // Altos
  { name: "Frida Ombogo", voicePart: "alto", isCORMember: true },
  { name: "Madeline Kanyadudi", voicePart: "alto" },
  { name: "Olga", voicePart: "alto" },
  { name: "Maryann Gitonga", voicePart: "alto" },
  { name: "Leah", voicePart: "alto" },
  { name: "Rahab Khisa", voicePart: "alto" },
  { name: "Monty Njaaga", voicePart: "alto" },

  // Tenors
  { name: "Irush", voicePart: "tenor", isCORMember: true },
  { name: "JM", voicePart: "tenor" },
  { name: "Jerome", voicePart: "tenor" },
  { name: "Ryan", voicePart: "tenor" },
  { name: "Karoli", voicePart: "tenor" },

  // Basses
  {
    name: "Sam Kariuki",
    voicePart: "bass",
    isConductor: true,
    isCORMember: true,
  },
  { name: "Jamo", voicePart: "bass" },
  { name: "Michael Makonnen", voicePart: "bass" },
  { name: "Dave", voicePart: "bass" },
  { name: "Barry", voicePart: "bass" },
  { name: "Anto", voicePart: "bass" },
  { name: "Bob Odero", voicePart: "bass", isCORMember: true },

  // Instrumentalists
  {
    name: "Irénée Vunabandi",
    voicePart: "instrumentalist",
    instrument: "Piano",
  },
  {
    name: "Raphael Kariuki",
    voicePart: "instrumentalist",
    instrument: "Percussion",
  },
];

async function main() {
  const client = createClient({ url: DB_URL, authToken: DB_TOKEN });
  const db = drizzle(client, { schema });

  console.log("Seeding artists...");

  for (const m of members) {
    const [row] = await db
      .insert(schema.artists)
      .values({
        name: m.name,
        voicePart: m.voicePart,
        instrument: m.instrument ?? null,
        isConductor: m.isConductor ?? false,
        isCORMember: m.isCORMember ?? false,
      })
      .onConflictDoNothing()
      .returning({ id: schema.artists.id });

    if (row) {
      console.log(`  Created: ${m.name} (id=${row.id})`);
    } else {
      console.log(`  Skipped (exists): ${m.name}`);
    }
  }

  console.log(`\nDone! Seeded ${members.length} artists.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
