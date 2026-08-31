import { describe, expect, it } from "vitest";
import { aveEva, formatEventDate } from "@/data/ave-eva";

describe("formatEventDate", () => {
  it("renders an ISO date in long en-GB form", () => {
    expect(formatEventDate("2026-09-13")).toBe("Sunday, 13 September 2026");
  });

  it("reads the date as local time, so the day never drifts", () => {
    // Parsing "2026-01-01" as UTC would render 31 December in negative offsets.
    expect(formatEventDate("2026-01-01")).toContain("1 January 2026");
  });
});

describe("aveEva", () => {
  it("has a performance date formatEventDate can render", () => {
    expect(aveEva.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(formatEventDate(aveEva.date)).not.toContain("Invalid");
  });

  it("prices every ticket tier and marks exactly one as featured", () => {
    expect(aveEva.tickets.length).toBeGreaterThan(0);
    for (const tier of aveEva.tickets) {
      expect(tier.price).toBeGreaterThan(0);
      expect(tier.currency).toBeTruthy();
    }
    expect(
      aveEva.tickets.filter((t) => "featured" in t && t.featured),
    ).toHaveLength(1);
  });
});
