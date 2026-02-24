import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getAllHymns, searchHymns } from "@/lib/db/queries/hymns";

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

  const hymns = q
    ? await searchHymns(q, limit, offset)
    : await getAllHymns(limit, offset);

  return NextResponse.json(hymns);
}
