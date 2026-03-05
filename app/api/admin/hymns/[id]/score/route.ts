import { existsSync } from "node:fs";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { resolveScoreUrl } from "@/lib/blob";
import { updateHymn } from "@/lib/db/mutations/hymns";
import { getHymnWithVerses } from "@/lib/db/queries/hymns";

const ALLOWED_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
]);
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

async function uploadBlob(path: string, file: File): Promise<string> {
  const { put } = await import("@vercel/blob");
  const blob = await put(path, file, {
    access: "private",
    addRandomSuffix: true,
    contentType: file.type,
  });
  return blob.url;
}

async function deleteBlob(url: string): Promise<void> {
  const { del } = await import("@vercel/blob");
  await del(url);
}

const SCORES_DIR = join(process.cwd(), "public", "scores");

async function uploadLocal(filename: string, file: File): Promise<string> {
  if (!existsSync(SCORES_DIR)) {
    await mkdir(SCORES_DIR, { recursive: true });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(join(SCORES_DIR, filename), buffer);
  return `/scores/${filename}`;
}

async function deleteLocal(url: string): Promise<void> {
  const filepath = join(process.cwd(), "public", url);
  if (existsSync(filepath)) {
    await unlink(filepath);
  }
}

function isLocalUrl(url: string): boolean {
  return url.startsWith("/scores/");
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

  const hymn = await getHymnWithVerses(hymnId);
  if (!hymn) {
    return NextResponse.json({ error: "Hymn not found" }, { status: 404 });
  }

  if (hymn.scoreUrl) {
    try {
      if (isLocalUrl(hymn.scoreUrl)) {
        await deleteLocal(hymn.scoreUrl);
      } else {
        await deleteBlob(hymn.scoreUrl);
      }
    } catch {
      // Ignore cleanup errors
    }
  }

  const ext = file.name.split(".").pop() ?? "bin";
  const filename = `${hymnId}-${Date.now()}.${ext}`;

  const scoreUrl = useBlob
    ? await uploadBlob(`scores/${filename}`, file)
    : await uploadLocal(filename, file);

  await updateHymn(hymnId, { scoreUrl });

  return NextResponse.json({ scoreUrl: resolveScoreUrl(scoreUrl) });
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
      if (isLocalUrl(hymn.scoreUrl)) {
        await deleteLocal(hymn.scoreUrl);
      } else {
        await deleteBlob(hymn.scoreUrl);
      }
    } catch {
      // Ignore cleanup errors
    }
  }

  await updateHymn(hymnId, { scoreUrl: null });
  return NextResponse.json({ ok: true });
}
