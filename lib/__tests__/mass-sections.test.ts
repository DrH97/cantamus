import { describe, expect, it } from "vitest";
import { slugifySection, sortBySection } from "@/lib/mass-sections";

describe("slugifySection", () => {
  it("lowercases and hyphenates", () => {
    expect(slugifySection("Pater Noster")).toBe("pater-noster");
    expect(slugifySection("Our Father")).toBe("our-father");
  });

  it("drops accents and punctuation", () => {
    expect(slugifySection("  Ave María!  ")).toBe("ave-maria");
    expect(slugifySection("Lamb of God (Agnus Dei)")).toBe(
      "lamb-of-god-agnus-dei",
    );
  });

  it("matches the slugs of the original sections", () => {
    expect(slugifySection("Mysterium Fidei")).toBe("mysterium-fidei");
    expect(slugifySection("Agnus Dei")).toBe("agnus-dei");
  });

  it("returns an empty slug for a label with no letters or digits", () => {
    expect(slugifySection(" -- ")).toBe("");
  });
});

describe("sortBySection", () => {
  const order = ["introit", "amen", "pater-noster", "agnus-dei"];
  const song = (massSection: string, sortOrder = 0) => ({
    massSection,
    sortOrder,
  });

  it("orders songs by their section's position", () => {
    const sorted = sortBySection(
      [song("agnus-dei"), song("pater-noster"), song("introit")],
      order,
    );
    expect(sorted.map((s) => s.massSection)).toEqual([
      "introit",
      "pater-noster",
      "agnus-dei",
    ]);
  });

  it("keeps songs within a section in their sort order", () => {
    const sorted = sortBySection(
      [song("amen", 1), song("introit"), song("amen", 0)],
      order,
    );
    expect(sorted.map((s) => [s.massSection, s.sortOrder])).toEqual([
      ["introit", 0],
      ["amen", 0],
      ["amen", 1],
    ]);
  });

  it("puts songs from unknown sections last instead of dropping them", () => {
    const sorted = sortBySection([song("gone"), song("introit")], order);
    expect(sorted.map((s) => s.massSection)).toEqual(["introit", "gone"]);
  });

  it("does not mutate its input", () => {
    const input = [song("amen"), song("introit")];
    sortBySection(input, order);
    expect(input.map((s) => s.massSection)).toEqual(["amen", "introit"]);
  });
});
