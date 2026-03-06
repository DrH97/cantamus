import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import {
  createArtist,
  getAllArtists,
  searchArtists,
} from "@/lib/db/queries/artists";

export async function GET(request: Request) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const limit = Number(searchParams.get("limit") ?? "50");
  const offset = Number(searchParams.get("offset") ?? "0");

  const artists = q
    ? await searchArtists(q, limit, offset)
    : await getAllArtists(limit, offset);

  return NextResponse.json(artists);
}

export async function POST(request: Request) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  if (!body.name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const id = await createArtist(body);
  return NextResponse.json({ id }, { status: 201 });
}
