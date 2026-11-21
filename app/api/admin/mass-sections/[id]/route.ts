import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import {
  deleteMassSection,
  MassSectionError,
  moveMassSection,
  renameMassSection,
} from "@/lib/db/mutations/mass-sections";

/** Body: { label } to rename, or { move: "up" | "down" } to reorder. */
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

  try {
    if (body.move === "up" || body.move === "down") {
      await moveMassSection(Number(id), body.move);
    } else if (typeof body.label === "string") {
      await renameMassSection(Number(id), body.label);
    } else {
      return NextResponse.json(
        { error: "Send a label or a move" },
        { status: 400 },
      );
    }
  } catch (err) {
    if (err instanceof MassSectionError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    throw err;
  }

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
  try {
    await deleteMassSection(Number(id));
  } catch (err) {
    if (err instanceof MassSectionError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    throw err;
  }

  return NextResponse.json({ ok: true });
}
