import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { addVerse, deleteVerse, updateVerse } from "@/lib/db/queries/hymns";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: hymnId } = await params;
  const body = await request.json();

  if (!body.verseText?.trim()) {
    return NextResponse.json(
      { error: "Verse text is required" },
      { status: 400 },
    );
  }

  const verseId = await addVerse({
    hymnId: Number(hymnId),
    verseNumber: body.verseNumber ?? 1,
    verseText: body.verseText,
    isChorus: body.isChorus ?? false,
    language: body.language ?? "en",
  });

  return NextResponse.json({ id: verseId }, { status: 201 });
}

export async function PUT(request: Request) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  if (!body.id) {
    return NextResponse.json(
      { error: "Verse id is required" },
      { status: 400 },
    );
  }

  await updateVerse(body.id, {
    verseNumber: body.verseNumber,
    verseText: body.verseText,
    isChorus: body.isChorus,
    language: body.language,
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
  const verseId = searchParams.get("verseId");
  if (!verseId) {
    return NextResponse.json(
      { error: "verseId query param required" },
      { status: 400 },
    );
  }

  await deleteVerse(Number(verseId));
  return NextResponse.json({ ok: true });
}
