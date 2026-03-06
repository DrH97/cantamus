import { eq, like, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { artists } from "@/db/schema";

export async function getAllArtists(limit = 50, offset = 0) {
  return db.query.artists.findMany({
    limit,
    offset,
    orderBy: artists.name,
  });
}

export async function searchArtists(query: string, limit = 50, offset = 0) {
  const pattern = `%${query}%`;
  return db.query.artists.findMany({
    where: or(
      like(artists.name, pattern),
      like(artists.voicePart, pattern),
      like(artists.instrument, pattern),
    ),
    limit,
    offset,
    orderBy: artists.name,
  });
}

export async function getArtist(id: number) {
  const artist = await db.query.artists.findFirst({
    where: eq(artists.id, id),
  });
  return artist ?? null;
}

export async function getArtistCount() {
  const [row] = await db.select({ count: sql<number>`COUNT(*)` }).from(artists);
  return row.count;
}

export async function getArtistsByVoicePart(voicePart: string) {
  return db.query.artists.findMany({
    where: eq(artists.voicePart, voicePart),
    orderBy: artists.name,
  });
}

export async function getCORArtists() {
  return db.query.artists.findMany({
    where: eq(artists.isCORMember, true),
    orderBy: artists.name,
  });
}

export async function getConductorArtists() {
  return db.query.artists.findMany({
    where: eq(artists.isConductor, true),
    orderBy: artists.name,
  });
}

export async function createArtist(data: {
  name: string;
  voicePart?: string | null;
  instrument?: string | null;
  isConductor?: boolean;
  isCORMember?: boolean;
  bio?: string | null;
  website?: string | null;
}) {
  const [row] = await db
    .insert(artists)
    .values({
      name: data.name,
      voicePart: data.voicePart ?? null,
      instrument: data.instrument ?? null,
      isConductor: data.isConductor ?? false,
      isCORMember: data.isCORMember ?? false,
      bio: data.bio ?? null,
      website: data.website ?? null,
    })
    .returning({ id: artists.id });
  return row.id;
}
