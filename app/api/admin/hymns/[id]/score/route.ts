import { del, put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { updateHymn } from "@/lib/db/mutations/hymns";
import { getHymnWithVerses } from "@/lib/db/queries/hymns";

const ALLOWED_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
]);
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const hymnId = Number(id);

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Invalid file type. Allowed: PDF, PNG, JPEG, WebP" },
      { status: 400 },
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File too large. Maximum 10 MB" },
      { status: 400 },
    );
  }

  const hymn = await getHymnWithVerses(hymnId);
  if (!hymn) {
    return NextResponse.json({ error: "Hymn not found" }, { status: 404 });
  }

  // Delete old blob if it exists
  if (hymn.scoreUrl) {
    try {
      await del(hymn.scoreUrl);
    } catch {
      // Old URL might not be a blob URL, ignore
    }
  }

  const ext = file.name.split(".").pop() ?? "bin";
  const blob = await put(`scores/${hymnId}-${Date.now()}.${ext}`, file, {
    access: "public",
    contentType: file.type,
  });

  await updateHymn(hymnId, { scoreUrl: blob.url });

  return NextResponse.json({ scoreUrl: blob.url });
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
  const hymnId = Number(id);

  const hymn = await getHymnWithVerses(hymnId);
  if (!hymn) {
    return NextResponse.json({ error: "Hymn not found" }, { status: 404 });
  }

  if (hymn.scoreUrl) {
    try {
      await del(hymn.scoreUrl);
    } catch {
      // Ignore if not a blob URL
    }
  }

  await updateHymn(hymnId, { scoreUrl: null });
  return NextResponse.json({ ok: true });
}
