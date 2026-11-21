import { asc, count } from "drizzle-orm";
import { db } from "@/db";
import { massProgramSongs, massSections } from "@/db/schema";

export async function getMassSections() {
  return db
    .select()
    .from(massSections)
    .orderBy(asc(massSections.sortOrder), asc(massSections.id));
}

/** Sections with how many program songs are filed under each. */
export async function getMassSectionsWithUsage() {
  const [sections, usage] = await Promise.all([
    getMassSections(),
    db
      .select({ slug: massProgramSongs.massSection, songs: count() })
      .from(massProgramSongs)
      .groupBy(massProgramSongs.massSection),
  ]);
  const bySlug = new Map(usage.map((u) => [u.slug, u.songs]));
  return sections.map((s) => ({ ...s, songCount: bySlug.get(s.slug) ?? 0 }));
}
