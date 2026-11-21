/** Turn a section label into the slug stored on program songs. */
export function slugifySection(label: string): string {
  return label
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Order program songs by their section's position, then by their order
 * within it. Songs whose section no longer exists sort last rather than
 * disappearing.
 */
export function sortBySection<
  T extends { massSection: string; sortOrder: number },
>(songs: T[], sectionOrder: string[]): T[] {
  const rank = (slug: string) => {
    const i = sectionOrder.indexOf(slug);
    return i === -1 ? sectionOrder.length : i;
  };
  return [...songs].sort(
    (a, b) =>
      rank(a.massSection) - rank(b.massSection) || a.sortOrder - b.sortOrder,
  );
}
