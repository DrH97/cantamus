import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { hymns } from "@/db/schema";

export async function toggleFavourite(id: string) {
  const hymn = await db.query.hymns.findFirst({
    where: eq(hymns.id, id),
    columns: { isFavourite: true },
  });
  if (!hymn) return null;

  const newValue = !hymn.isFavourite;
  await db
    .update(hymns)
    .set({ isFavourite: newValue, updatedAt: sql`(datetime('now'))` })
    .where(eq(hymns.id, id));
  return newValue;
}

export async function toggleWedding(id: string) {
  const hymn = await db.query.hymns.findFirst({
    where: eq(hymns.id, id),
    columns: { isWedding: true },
  });
  if (!hymn) return null;

  const newValue = !hymn.isWedding;
  await db
    .update(hymns)
    .set({ isWedding: newValue, updatedAt: sql`(datetime('now'))` })
    .where(eq(hymns.id, id));
  return newValue;
}

export async function updateHymn(
  id: string,
  data: {
    title?: string;
    composer?: string | null;
    tradition?: string | null;
    language?: string | null;
  },
) {
  await db
    .update(hymns)
    .set({ ...data, updatedAt: sql`(datetime('now'))` })
    .where(eq(hymns.id, id));
}

export async function deleteHymn(id: string) {
  await db.delete(hymns).where(eq(hymns.id, id));
}
