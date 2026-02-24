import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { massProgramSongs, massPrograms } from "@/db/schema";

export async function createMassProgram(data: {
  date: string;
  title?: string;
}) {
  const id = crypto.randomUUID();
  await db.insert(massPrograms).values({
    id,
    date: data.date,
    title: data.title ?? null,
  });
  return id;
}

export async function updateMassProgram(
  id: string,
  data: { date?: string; title?: string | null },
) {
  await db
    .update(massPrograms)
    .set({ ...data, updatedAt: sql`(datetime('now'))` })
    .where(eq(massPrograms.id, id));
}

export async function deleteMassProgram(id: string) {
  await db.delete(massPrograms).where(eq(massPrograms.id, id));
}

export async function addSongToProgram(data: {
  massProgramId: string;
  hymnId: string;
  massSection: string;
  sortOrder: number;
  lyricsOverride?: string;
}) {
  const id = crypto.randomUUID();
  await db.insert(massProgramSongs).values({
    id,
    massProgramId: data.massProgramId,
    hymnId: data.hymnId,
    massSection: data.massSection,
    sortOrder: data.sortOrder,
    lyricsOverride: data.lyricsOverride ?? null,
  });
  return id;
}

export async function removeSongFromProgram(songId: string) {
  await db.delete(massProgramSongs).where(eq(massProgramSongs.id, songId));
}

export async function updateProgramSong(
  songId: string,
  data: {
    massSection?: string;
    sortOrder?: number;
    lyricsOverride?: string | null;
  },
) {
  await db
    .update(massProgramSongs)
    .set(data)
    .where(eq(massProgramSongs.id, songId));
}
