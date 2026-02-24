import { eq, like, or } from "drizzle-orm";
import { db } from "@/db";
import { hymnCategories, hymns, hymnVerses } from "@/db/schema";

export async function getFavouriteHymns() {
  return db.query.hymns.findMany({
    where: eq(hymns.isFavourite, true),
    orderBy: hymns.title,
  });
}

export async function getWeddingHymns() {
  return db.query.hymns.findMany({
    where: eq(hymns.isWedding, true),
    orderBy: hymns.title,
  });
}

export async function getHymnWithVerses(id: string) {
  const hymn = await db.query.hymns.findFirst({
    where: eq(hymns.id, id),
  });
  if (!hymn) return null;

  const verses = await db.query.hymnVerses.findMany({
    where: eq(hymnVerses.hymnId, id),
    orderBy: hymnVerses.verseNumber,
  });

  return { ...hymn, verses };
}

export async function searchHymns(query: string, limit = 50, offset = 0) {
  const pattern = `%${query}%`;
  return db.query.hymns.findMany({
    where: or(like(hymns.title, pattern), like(hymns.composer, pattern)),
    limit,
    offset,
    orderBy: hymns.title,
  });
}

export async function getAllHymns(limit = 50, offset = 0) {
  return db.query.hymns.findMany({
    limit,
    offset,
    orderBy: hymns.title,
  });
}

export async function getHymnsByCategory(categoryId: string) {
  const links = await db.query.hymnCategories.findMany({
    where: eq(hymnCategories.categoryId, categoryId),
  });
  if (links.length === 0) return [];

  const hymnIds = links.map((l) => l.hymnId);
  const results = await db.query.hymns.findMany({
    orderBy: hymns.title,
  });
  return results.filter((h) => hymnIds.includes(h.id));
}

export async function getHymnCount() {
  const all = await db.select({ id: hymns.id }).from(hymns);
  return all.length;
}

export async function getFavouriteHymnCount() {
  const all = await db
    .select({ id: hymns.id })
    .from(hymns)
    .where(eq(hymns.isFavourite, true));
  return all.length;
}
