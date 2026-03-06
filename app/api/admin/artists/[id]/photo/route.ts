import { existsSync } from "node:fs";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { updateArtist } from "@/lib/db/mutations/artists";
import { getArtist } from "@/lib/db/queries/artists";

const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

async function uploadBlob(path: string, file: File): Promise<string> {
  const { put } = await import("@vercel/blob");
  const blob = await put(path, file, {
    access: "public",
    addRandomSuffix: true,
    contentType: file.type,
  });
  return blob.url;
}

async function deleteBlob(url: string): Promise<void> {
  const { del } = await import("@vercel/blob");
  await del(url);
}

const PHOTOS_DIR = join(process.cwd(), "public", "photos");

async function uploadLocal(filename: string, file: File): Promise<string> {
  if (!existsSync(PHOTOS_DIR)) {
    await mkdir(PHOTOS_DIR, { recursive: true });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(join(PHOTOS_DIR, filename), buffer);
  return `/photos/${filename}`;
}

async function deleteLocal(url: string): Promise<void> {
  const filepath = join(process.cwd(), "public", url);
  if (existsSync(filepath)) {
    await unlink(filepath);
  }
}

function isLocalUrl(url: string): boolean {
  return url.startsWith("/photos/");
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
  const artistId = Number(id);

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Invalid file type. Allowed: PNG, JPEG, WebP" },
      { status: 400 },
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File too large. Maximum 5 MB" },
      { status: 400 },
    );
  }

  const artist = await getArtist(artistId);
  if (!artist) {
    return NextResponse.json({ error: "Artist not found" }, { status: 404 });
  }

  if (artist.photoUrl) {
    try {
      if (isLocalUrl(artist.photoUrl)) {
        await deleteLocal(artist.photoUrl);
      } else {
        await deleteBlob(artist.photoUrl);
      }
    } catch {
      // Ignore cleanup errors
    }
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const filename = `artist-${artistId}-${Date.now()}.${ext}`;

  const photoUrl = useBlob
    ? await uploadBlob(`photos/${filename}`, file)
    : await uploadLocal(filename, file);

  await updateArtist(artistId, { photoUrl });

  return NextResponse.json({ photoUrl });
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
  const artistId = Number(id);

  const artist = await getArtist(artistId);
  if (!artist) {
    return NextResponse.json({ error: "Artist not found" }, { status: 404 });
  }

  if (artist.photoUrl) {
    try {
      if (isLocalUrl(artist.photoUrl)) {
        await deleteLocal(artist.photoUrl);
      } else {
        await deleteBlob(artist.photoUrl);
      }
    } catch {
      // Ignore cleanup errors
    }
  }

  await updateArtist(artistId, { photoUrl: null });
  return NextResponse.json({ ok: true });
}
