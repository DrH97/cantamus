import { desc, eq, like, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { hymns, hymnTags, hymnVerses } from "@/db/schema";

export async function getFavouriteHymns() {
  return getHymnsByTag("favourite");
}

export async function getWeddingHymns() {
  return getHymnsByTag("wedding");
}

export async function getHymnsByTag(tag: string) {
  const rows = await db
    .select({
      id: hymns.id,
      title: hymns.title,
      composer: hymns.composer,
      tradition: hymns.tradition,
      language: hymns.language,
      hymnal: hymns.hymnal,
      scoreUrl: hymns.scoreUrl,
      link: hymns.link,
      createdAt: hymns.createdAt,
      updatedAt: hymns.updatedAt,
    })
    .from(hymns)
    .innerJoin(hymnTags, eq(hymnTags.hymnId, hymns.id))
    .where(eq(hymnTags.tag, tag))
    .orderBy(hymns.title);
  return rows;
}

export async function getHymnWithVerses(id: number) {
  const hymn = await db.query.hymns.findFirst({
    where: eq(hymns.id, id),
    with: {
      verses: { orderBy: (v, { asc }) => [asc(v.verseNumber)] },
      tags: true,
    },
  });
  return hymn ?? null;
}

export async function searchHymns(query: string, limit = 50, offset = 0) {
  const pattern = `%${query}%`;
  return db.query.hymns.findMany({
    where: or(like(hymns.title, pattern), like(hymns.composer, pattern)),
    with: { tags: true },
    limit,
    offset,
    orderBy: hymns.title,
  });
}

export async function getAllHymns(limit = 50, offset = 0) {
  return db.query.hymns.findMany({
    with: { tags: true },
    limit,
    offset,
    orderBy: hymns.title,
  });
}

export async function getHymnCount() {
  const [row] = await db.select({ count: sql<number>`COUNT(*)` }).from(hymns);
  return row.count;
}

export async function getFavouriteHymnCount() {
  const [row] = await db
    .select({ count: sql<number>`COUNT(DISTINCT ${hymnTags.hymnId})` })
    .from(hymnTags)
    .where(eq(hymnTags.tag, "favourite"));
  return row.count;
}

export async function getWeddingHymnCount() {
  const [row] = await db
    .select({ count: sql<number>`COUNT(DISTINCT ${hymnTags.hymnId})` })
    .from(hymnTags)
    .where(eq(hymnTags.tag, "wedding"));
  return row.count;
}

export async function getHymnsWithoutVersesCount() {
  const [row] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(hymns)
    .where(
      sql`${hymns.id} NOT IN (SELECT DISTINCT ${hymnVerses.hymnId} FROM ${hymnVerses})`,
    );
  return row.count;
}

export async function getHymnsWithoutTagsCount() {
  const [row] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(hymns)
    .where(
      sql`${hymns.id} NOT IN (SELECT DISTINCT ${hymnTags.hymnId} FROM ${hymnTags})`,
    );
  return row.count;
}

export async function getRecentHymns(limit = 10) {
  return db.query.hymns.findMany({
    with: { tags: true },
    orderBy: desc(hymns.updatedAt),
    limit,
  });
}

export async function getTagDistribution() {
  return db
    .select({
      tag: hymnTags.tag,
      count: sql<number>`COUNT(*)`,
    })
    .from(hymnTags)
    .groupBy(hymnTags.tag)
    .orderBy(sql`COUNT(*) DESC`);
}

export async function createHymn(data: {
  title: string;
  composer?: string | null;
  tradition?: string | null;
  language?: string | null;
  hymnal?: string | null;
  link?: string | null;
  scoreUrl?: string | null;
}) {
  const [row] = await db
    .insert(hymns)
    .values({
      title: data.title,
      composer: data.composer ?? null,
      tradition: data.tradition ?? null,
      language: data.language ?? null,
      hymnal: data.hymnal ?? null,
      link: data.link ?? null,
      scoreUrl: data.scoreUrl ?? null,
    })
    .returning({ id: hymns.id });
  return row.id;
}

export async function addVerse(data: {
  hymnId: number;
  verseNumber: number;
  verseText: string;
  isChorus?: boolean;
  language?: string;
}) {
  const [row] = await db
    .insert(hymnVerses)
    .values({
      hymnId: data.hymnId,
      verseNumber: data.verseNumber,
      verseText: data.verseText,
      isChorus: data.isChorus ?? false,
      language: data.language ?? "en",
    })
    .returning({ id: hymnVerses.id });
  return row.id;
}

export async function updateVerse(
  id: number,
  data: {
    verseNumber?: number;
    verseText?: string;
    isChorus?: boolean;
    language?: string;
  },
) {
  await db.update(hymnVerses).set(data).where(eq(hymnVerses.id, id));
}

export async function deleteVerse(id: number) {
  await db.delete(hymnVerses).where(eq(hymnVerses.id, id));
}
