import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("resolves conflicting Tailwind utilities in favour of the last one", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-text", "text-primary")).toBe("text-primary");
  });

  it("keeps utilities that do not conflict", () => {
    expect(cn("flex", "items-center")).toBe("flex items-center");
  });

  it("drops falsy values so conditional classes are safe", () => {
    expect(cn("flex", false && "hidden", null, undefined, "")).toBe("flex");
  });

  it("accepts arrays and conditional objects", () => {
    expect(cn(["flex", "gap-2"], { hidden: false, "px-4": true })).toBe(
      "flex gap-2 px-4",
    );
  });

  it("treats display utilities as conflicting, so the last one wins", () => {
    expect(cn("flex", "block")).toBe("block");
  });
});
