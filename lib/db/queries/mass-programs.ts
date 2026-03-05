import { eq, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { hymns, hymnVerses, massProgramSongs, massPrograms } from "@/db/schema";

export async function getMassProgramByDate(date: string) {
  return db.query.massPrograms.findFirst({
    where: eq(massPrograms.date, date),
  });
}

export async function getMassProgramWithSongs(date: string) {
  const program = await db.query.massPrograms.findFirst({
    where: eq(massPrograms.date, date),
  });
  if (!program) return null;

  const songRows = await db
    .select({
      id: massProgramSongs.id,
      massSection: massProgramSongs.massSection,
      sortOrder: massProgramSongs.sortOrder,
      lyricsOverride: massProgramSongs.lyricsOverride,
      hymnId: massProgramSongs.hymnId,
      hymnTitle: hymns.title,
      hymnComposer: hymns.composer,
      hymnTradition: hymns.tradition,
      hymnLanguage: hymns.language,
      hymnLink: hymns.link,
      hymnScoreUrl: hymns.scoreUrl,
    })
    .from(massProgramSongs)
    .innerJoin(hymns, eq(massProgramSongs.hymnId, hymns.id))
    .where(eq(massProgramSongs.massProgramId, program.id))
    .orderBy(massProgramSongs.sortOrder);

  // Fetch verses for all hymns in this program
  const hymnIds = [...new Set(songRows.map((s) => s.hymnId))];
  const verses =
    hymnIds.length > 0
      ? await db.query.hymnVerses.findMany({
          where: inArray(hymnVerses.hymnId, hymnIds),
          orderBy: hymnVerses.verseNumber,
        })
      : [];

  // Group verses by hymnId
  const versesByHymn = new Map<
    number,
    {
      verseNumber: number;
      verseText: string;
      isChorus: boolean;
      language: string;
    }[]
  >();
  for (const v of verses) {
    const list = versesByHymn.get(v.hymnId) ?? [];
    list.push({
      verseNumber: v.verseNumber,
      verseText: v.verseText,
      isChorus: v.isChorus,
      language: v.language,
    });
    versesByHymn.set(v.hymnId, list);
  }

  const songs = songRows.map((s) => ({
    ...s,
    hymnVerses: versesByHymn.get(s.hymnId) ?? [],
  }));

  return { ...program, songs };
}

export async function getAllMassPrograms() {
  return db.query.massPrograms.findMany({
    orderBy: massPrograms.date,
  });
}

export async function hasMassProgramForDate(date: string) {
  const result = await db.query.massPrograms.findFirst({
    where: eq(massPrograms.date, date),
    columns: { id: true },
  });
  return !!result;
}

export async function getMassProgramById(id: number) {
  return db.query.massPrograms.findFirst({
    where: eq(massPrograms.id, id),
  });
}

export async function getMassProgramSongsById(programId: number) {
  return db
    .select({
      id: massProgramSongs.id,
      massSection: massProgramSongs.massSection,
      sortOrder: massProgramSongs.sortOrder,
      lyricsOverride: massProgramSongs.lyricsOverride,
      hymnId: massProgramSongs.hymnId,
      hymnTitle: hymns.title,
      hymnComposer: hymns.composer,
      hymnTradition: hymns.tradition,
      hymnLanguage: hymns.language,
      hymnLink: hymns.link,
      hymnScoreUrl: hymns.scoreUrl,
    })
    .from(massProgramSongs)
    .innerJoin(hymns, eq(massProgramSongs.hymnId, hymns.id))
    .where(eq(massProgramSongs.massProgramId, programId))
    .orderBy(massProgramSongs.sortOrder);
}

export async function getMassProgramCount() {
  const [row] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(massPrograms);
  return row.count;
}

export async function getUpcomingPrograms(limit = 5) {
  const today = new Date().toISOString().split("T")[0];
  return db.query.massPrograms.findMany({
    where: sql`${massPrograms.date} >= ${today}`,
    orderBy: massPrograms.date,
    limit,
  });
}

export async function getRecentPrograms(limit = 5) {
  const today = new Date().toISOString().split("T")[0];
  return db.query.massPrograms.findMany({
    where: sql`${massPrograms.date} < ${today}`,
    orderBy: sql`${massPrograms.date} DESC`,
    limit,
  });
}
