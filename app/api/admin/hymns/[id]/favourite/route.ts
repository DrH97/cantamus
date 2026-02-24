import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { toggleFavourite } from "@/lib/db/mutations/hymns";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const newValue = await toggleFavourite(id);
  if (newValue === null) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ isFavourite: newValue });
}
