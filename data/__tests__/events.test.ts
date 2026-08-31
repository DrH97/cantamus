import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getThirdSundays, services } from "@/data/events";

/** Third Sunday = the 15th at the earliest, the 21st at the latest. */
function isThirdSunday(d: Date) {
  return d.getDay() === 0 && d.getDate() >= 15 && d.getDate() <= 21;
}

describe("getThirdSundays", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns one date per requested month", () => {
    vi.setSystemTime(new Date(2026, 7, 31));
    expect(getThirdSundays(2026, 7)).toHaveLength(7);
  });

  it("returns only third Sundays", () => {
    vi.setSystemTime(new Date(2026, 7, 31));
    for (const d of getThirdSundays(2026, 12)) {
      expect(isThirdSunday(d)).toBe(true);
    }
  });

  it("starts from the current month", () => {
    vi.setSystemTime(new Date(2026, 7, 31));
    const [first] = getThirdSundays(2026, 3);
    expect(first.getMonth()).toBe(7);
    expect(first.getFullYear()).toBe(2026);
  });

  it("rolls into the next year when the window crosses December", () => {
    vi.setSystemTime(new Date(2026, 10, 1));
    const dates = getThirdSundays(2026, 4);
    expect(dates.map((d) => d.getMonth())).toEqual([10, 11, 0, 1]);
    expect(dates.map((d) => d.getFullYear())).toEqual([2026, 2026, 2027, 2027]);
    for (const d of dates) expect(isThirdSunday(d)).toBe(true);
  });

  it("handles a month whose first day is itself a Sunday", () => {
    // 1 November 2026 is a Sunday, so the third Sunday is the 15th.
    vi.setSystemTime(new Date(2026, 10, 1));
    const [first] = getThirdSundays(2026, 1);
    expect(first.getDate()).toBe(15);
  });

  it("returns nothing for a zero-month window", () => {
    vi.setSystemTime(new Date(2026, 7, 31));
    expect(getThirdSundays(2026, 0)).toEqual([]);
  });
});

describe("services", () => {
  it("gives every service an id, title and description", () => {
    expect(services.length).toBeGreaterThan(0);
    for (const s of services) {
      expect(s.id).toBeTruthy();
      expect(s.title).toBeTruthy();
      expect(s.description).toBeTruthy();
    }
  });
});
