import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { deleteHymn, updateHymn } from "@/lib/db/mutations/hymns";
import { getHymnWithVerses } from "@/lib/db/queries/hymns";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const hymn = await getHymnWithVerses(id);
  if (!hymn) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(hymn);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  await updateHymn(id, body);
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await deleteHymn(id);
  return NextResponse.json({ ok: true });
}
