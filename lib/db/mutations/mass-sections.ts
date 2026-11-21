import { count, eq, gt, lt, max, sql } from "drizzle-orm";
import { db } from "@/db";
import { massProgramSongs, massSections } from "@/db/schema";
import { slugifySection } from "@/lib/mass-sections";

export class MassSectionError extends Error {}

export async function createMassSection(label: string) {
  const trimmed = label.trim();
  const slug = slugifySection(trimmed);
  if (!slug) throw new MassSectionError("A section needs a name");

  const [existing] = await db
    .select({ id: massSections.id })
    .from(massSections)
    .where(eq(massSections.slug, slug));
  if (existing) throw new MassSectionError(`"${trimmed}" already exists`);

  const [{ last }] = await db
    .select({ last: max(massSections.sortOrder) })
    .from(massSections);

  const [row] = await db
    .insert(massSections)
    .values({ slug, label: trimmed, sortOrder: (last ?? -1) + 1 })
    .returning();
  return row;
}

/** Renames the label only; the slug stays so existing songs keep their section. */
export async function renameMassSection(id: number, label: string) {
  const trimmed = label.trim();
  if (!trimmed) throw new MassSectionError("A section needs a name");
  await db
    .update(massSections)
    .set({ label: trimmed })
    .where(eq(massSections.id, id));
}

/** Swap a section with its neighbour above or below. */
export async function moveMassSection(id: number, direction: "up" | "down") {
  const [current] = await db
    .select()
    .from(massSections)
    .where(eq(massSections.id, id));
  if (!current) throw new MassSectionError("Section not found");

  const neighbourQuery = db
    .select()
    .from(massSections)
    .where(
      direction === "up"
        ? lt(massSections.sortOrder, current.sortOrder)
        : gt(massSections.sortOrder, current.sortOrder),
    )
    .orderBy(
      direction === "up"
        ? sql`${massSections.sortOrder} desc`
        : sql`${massSections.sortOrder} asc`,
    )
    .limit(1);
  const [neighbour] = await neighbourQuery;
  if (!neighbour) return;

  await db.batch([
    db
      .update(massSections)
      .set({ sortOrder: neighbour.sortOrder })
      .where(eq(massSections.id, current.id)),
    db
      .update(massSections)
      .set({ sortOrder: current.sortOrder })
      .where(eq(massSections.id, neighbour.id)),
  ]);
}

/** Refuses while any program still files a song under the section. */
export async function deleteMassSection(id: number) {
  const [section] = await db
    .select()
    .from(massSections)
    .where(eq(massSections.id, id));
  if (!section) throw new MassSectionError("Section not found");

  const [{ songs }] = await db
    .select({ songs: count() })
    .from(massProgramSongs)
    .where(eq(massProgramSongs.massSection, section.slug));
  if (songs > 0) {
    throw new MassSectionError(
      `${section.label} still has ${songs} song${songs === 1 ? "" : "s"} in programs. Move them first.`,
    );
  }

  await db.delete(massSections).where(eq(massSections.id, id));
}
