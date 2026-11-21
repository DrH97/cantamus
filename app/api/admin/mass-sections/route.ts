import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import {
  createMassSection,
  MassSectionError,
} from "@/lib/db/mutations/mass-sections";
import { getMassSectionsWithUsage } from "@/lib/db/queries/mass-sections";

export async function GET() {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(await getMassSectionsWithUsage());
}

export async function POST(request: Request) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { label } = await request.json();
  if (typeof label !== "string") {
    return NextResponse.json({ error: "label is required" }, { status: 400 });
  }

  try {
    const section = await createMassSection(label);
    return NextResponse.json(section, { status: 201 });
  } catch (err) {
    if (err instanceof MassSectionError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    throw err;
  }
}
