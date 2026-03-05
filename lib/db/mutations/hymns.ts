import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { hymns, hymnTags } from "@/db/schema";

export async function toggleTag(id: number, tag: string) {
  const hymn = await db.query.hymns.findFirst({
    where: eq(hymns.id, id),
    columns: { id: true },
  });
  if (!hymn) return null;

  const existing = await db.query.hymnTags.findFirst({
    where: and(eq(hymnTags.hymnId, id), eq(hymnTags.tag, tag)),
  });

  if (existing) {
    await db
      .delete(hymnTags)
      .where(and(eq(hymnTags.hymnId, id), eq(hymnTags.tag, tag)));
    return false;
  }

  await db.insert(hymnTags).values({ hymnId: id, tag });
  return true;
}

export async function updateHymn(
  id: number,
  data: {
    title?: string;
    composer?: string | null;
    tradition?: string | null;
    language?: string | null;
    hymnal?: string | null;
    link?: string | null;
    scoreUrl?: string | null;
  },
) {
  await db
    .update(hymns)
    .set({ ...data, updatedAt: sql`(unixepoch())` })
    .where(eq(hymns.id, id));
}

export async function deleteHymn(id: number) {
  await db.delete(hymns).where(eq(hymns.id, id));
}
