import { describe, expect, it } from "vitest";
import { aveEva, formatEventDate, isAveEvaOver } from "@/data/ave-eva";

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

describe("isAveEvaOver", () => {
  const [y, m, d] = aveEva.date.split("-").map(Number);

  it("is not over well before the performance", () => {
    expect(isAveEvaOver(new Date(y, m - 1, d - 30, 12))).toBe(false);
  });

  it("is not over the day before", () => {
    expect(isAveEvaOver(new Date(y, m - 1, d - 1, 23, 59))).toBe(false);
  });

  it("is not over on the day itself, right up to the last minute", () => {
    expect(isAveEvaOver(new Date(y, m - 1, d, 0, 0))).toBe(false);
    expect(isAveEvaOver(new Date(y, m - 1, d, 23, 59))).toBe(false);
  });

  it("is over from the next local midnight", () => {
    expect(isAveEvaOver(new Date(y, m - 1, d + 1, 0, 0))).toBe(true);
  });

  it("stays over long afterwards, including across a year boundary", () => {
    expect(isAveEvaOver(new Date(y + 1, 0, 1, 12))).toBe(true);
  });

  it("compares calendar days, so a late-evening check does not flip early", () => {
    // A timestamp comparison against midnight-UTC would call this over in a
    // positive offset; a local calendar-day comparison does not.
    expect(isAveEvaOver(new Date(y, m - 1, d, 22, 30))).toBe(false);
  });
});
