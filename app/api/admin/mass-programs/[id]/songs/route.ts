import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import {
  addSongToProgram,
  removeSongFromProgram,
  updateProgramSong,
} from "@/lib/db/mutations/mass-programs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: massProgramId } = await params;
  const body = await request.json();
  const { hymnId, massSection, sortOrder, lyricsOverride } = body;

  if (!hymnId || !massSection) {
    return NextResponse.json(
      { error: "hymnId and massSection are required" },
      { status: 400 },
    );
  }

  const songId = await addSongToProgram({
    massProgramId: Number(massProgramId),
    hymnId: Number(hymnId),
    massSection,
    sortOrder: sortOrder ?? 0,
    lyricsOverride,
  });

  return NextResponse.json({ id: songId }, { status: 201 });
}

export async function PUT(request: Request) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { songId, massSection, sortOrder, lyricsOverride } = body;

  if (!songId) {
    return NextResponse.json({ error: "songId is required" }, { status: 400 });
  }

  await updateProgramSong(Number(songId), {
    ...(massSection !== undefined && { massSection }),
    ...(sortOrder !== undefined && { sortOrder }),
    ...(lyricsOverride !== undefined && { lyricsOverride }),
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const songId = searchParams.get("songId");

  if (!songId) {
    return NextResponse.json(
      { error: "songId query param required" },
      { status: 400 },
    );
  }

  await removeSongFromProgram(Number(songId));
  return NextResponse.json({ ok: true });
}
