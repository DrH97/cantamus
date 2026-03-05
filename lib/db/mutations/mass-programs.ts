import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { massProgramSongs, massPrograms } from "@/db/schema";

export async function createMassProgram(data: {
  date: string;
  title?: string;
}) {
  const [row] = await db
    .insert(massPrograms)
    .values({ date: data.date, title: data.title ?? null })
    .returning({ id: massPrograms.id });
  return row.id;
}

export async function updateMassProgram(
  id: number,
  data: { date?: string; title?: string | null },
) {
  await db
    .update(massPrograms)
    .set({ ...data, updatedAt: sql`(unixepoch())` })
    .where(eq(massPrograms.id, id));
}

export async function deleteMassProgram(id: number) {
  await db.delete(massPrograms).where(eq(massPrograms.id, id));
}

export async function addSongToProgram(data: {
  massProgramId: number;
  hymnId: number;
  massSection: string;
  sortOrder: number;
  lyricsOverride?: string;
}) {
  const [row] = await db
    .insert(massProgramSongs)
    .values({
      massProgramId: data.massProgramId,
      hymnId: data.hymnId,
      massSection: data.massSection,
      sortOrder: data.sortOrder,
      lyricsOverride: data.lyricsOverride ?? null,
    })
    .returning({ id: massProgramSongs.id });
  return row.id;
}

export async function removeSongFromProgram(songId: number) {
  await db.delete(massProgramSongs).where(eq(massProgramSongs.id, songId));
}

export async function updateProgramSong(
  songId: number,
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
