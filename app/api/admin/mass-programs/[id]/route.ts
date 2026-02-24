import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import {
  deleteMassProgram,
  updateMassProgram,
} from "@/lib/db/mutations/mass-programs";
import {
  getMassProgramById,
  getMassProgramSongsById,
} from "@/lib/db/queries/mass-programs";

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
  const program = await getMassProgramById(id);
  if (!program) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const songs = await getMassProgramSongsById(id);
  return NextResponse.json({ ...program, songs });
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
  await updateMassProgram(id, body);
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
  await deleteMassProgram(id);
  return NextResponse.json({ ok: true });
}
