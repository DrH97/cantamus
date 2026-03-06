import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { artists } from "@/db/schema";

export async function updateArtist(
  id: number,
  data: {
    name?: string;
    voicePart?: string | null;
    instrument?: string | null;
    isConductor?: boolean;
    isCORMember?: boolean;
    photoUrl?: string | null;
    bio?: string | null;
    website?: string | null;
  },
) {
  await db
    .update(artists)
    .set({ ...data, updatedAt: sql`(unixepoch())` })
    .where(eq(artists.id, id));
}

export async function deleteArtist(id: number) {
  await db.delete(artists).where(eq(artists.id, id));
}
