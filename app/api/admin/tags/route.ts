import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getTagDistribution } from "@/lib/db/queries/hymns";

export async function GET() {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tags = await getTagDistribution();
  return NextResponse.json(tags);
}
