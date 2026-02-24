import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import {
  addSongToProgram,
  removeSongFromProgram,
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
    massProgramId,
    hymnId,
    massSection,
    sortOrder: sortOrder ?? 0,
    lyricsOverride,
  });

  return NextResponse.json({ id: songId }, { status: 201 });
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

  await removeSongFromProgram(songId);
  return NextResponse.json({ ok: true });
}
