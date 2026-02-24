import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { createMassProgram } from "@/lib/db/mutations/mass-programs";
import { getAllMassPrograms } from "@/lib/db/queries/mass-programs";

export async function GET() {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const programs = await getAllMassPrograms();
  return NextResponse.json(programs);
}

export async function POST(request: Request) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { date, title } = body;

  if (!date) {
    return NextResponse.json({ error: "Date is required" }, { status: 400 });
  }

  const id = await createMassProgram({ date, title });
  return NextResponse.json({ id }, { status: 201 });
}
