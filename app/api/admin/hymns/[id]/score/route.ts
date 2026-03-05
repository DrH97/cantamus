import { existsSync } from "node:fs";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { updateHymn } from "@/lib/db/mutations/hymns";
import { getHymnWithVerses } from "@/lib/db/queries/hymns";

const SCORES_DIR = join(process.cwd(), "public", "scores");
const ALLOWED_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
]);
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

function getExtension(mime: string): string {
  const map: Record<string, string> = {
    "application/pdf": "pdf",
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
  };
  return map[mime] ?? "bin";
}

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

  // Delete old score file if it exists
  const hymn = await getHymnWithVerses(hymnId);
  if (!hymn) {
    return NextResponse.json({ error: "Hymn not found" }, { status: 404 });
  }

  if (hymn.scoreUrl?.startsWith("/scores/")) {
    const oldPath = join(process.cwd(), "public", hymn.scoreUrl);
    if (existsSync(oldPath)) {
      await unlink(oldPath);
    }
  }

  // Save new file
  if (!existsSync(SCORES_DIR)) {
    await mkdir(SCORES_DIR, { recursive: true });
  }

  const ext = getExtension(file.type);
  const filename = `${hymnId}-${Date.now()}.${ext}`;
  const filepath = join(SCORES_DIR, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filepath, buffer);

  const scoreUrl = `/scores/${filename}`;
  await updateHymn(hymnId, { scoreUrl });

  return NextResponse.json({ scoreUrl });
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

  if (hymn.scoreUrl?.startsWith("/scores/")) {
    const oldPath = join(process.cwd(), "public", hymn.scoreUrl);
    if (existsSync(oldPath)) {
      await unlink(oldPath);
    }
  }

  await updateHymn(hymnId, { scoreUrl: null });
  return NextResponse.json({ ok: true });
}
