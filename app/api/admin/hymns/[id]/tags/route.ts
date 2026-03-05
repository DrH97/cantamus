import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { hymnTags } from "@/db/schema";
import { requireAuth } from "@/lib/auth";
import { toggleTag } from "@/lib/db/mutations/hymns";

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
  const body = await request.json();
  if (!body.tag?.trim()) {
    return NextResponse.json({ error: "Tag is required" }, { status: 400 });
  }

  const result = await toggleTag(Number(id), body.tag.trim().toLowerCase());
  return NextResponse.json({ added: result });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get("tag");
  if (!tag) {
    return NextResponse.json(
      { error: "tag query param required" },
      { status: 400 },
    );
  }

  await db
    .delete(hymnTags)
    .where(and(eq(hymnTags.hymnId, Number(id)), eq(hymnTags.tag, tag)));
  return NextResponse.json({ ok: true });
}
