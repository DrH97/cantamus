import { describe, expect, it } from "vitest";
import { resolvePhotoUrl, resolveScoreUrl } from "@/lib/blob";

describe("resolveScoreUrl", () => {
  it("returns null when there is no url", () => {
    expect(resolveScoreUrl(null)).toBeNull();
  });

  it("passes local paths through untouched", () => {
    expect(resolveScoreUrl("/scores/test-score.png")).toBe(
      "/scores/test-score.png",
    );
  });

  it("rewrites a private blob url to the streaming proxy", () => {
    expect(
      resolveScoreUrl(
        "https://abc123.public.blob.vercel-storage.com/scores/kyrie.pdf",
      ),
    ).toBe("/api/scores?pathname=scores%2Fkyrie.pdf");
  });

  it("encodes nested pathnames for the proxy query string", () => {
    expect(
      resolveScoreUrl("https://abc123.blob.vercel-storage.com/scores/a/b.pdf"),
    ).toBe("/api/scores?pathname=scores%2Fa%2Fb.pdf");
  });

  // Documents current behaviour, not desired behaviour: URL parsing already
  // percent-escapes the pathname, and encodeURIComponent then escapes the "%".
  // The proxy decodes only once, so such a blob would not be found.
  it("double-encodes a pathname that URL normalisation has already escaped", () => {
    expect(
      resolveScoreUrl("https://abc123.blob.vercel-storage.com/a b/c.pdf"),
    ).toBe("/api/scores?pathname=a%2520b%2Fc.pdf");
  });

  it("returns the value unchanged when it is not a parseable url", () => {
    expect(resolveScoreUrl("scores/relative.pdf")).toBe("scores/relative.pdf");
  });
});

describe("resolvePhotoUrl", () => {
  it("routes through the photos proxy rather than the scores one", () => {
    expect(
      resolvePhotoUrl(
        "https://abc123.public.blob.vercel-storage.com/photos/jane.jpg",
      ),
    ).toBe("/api/photos?pathname=photos%2Fjane.jpg");
  });

  it("passes local paths through untouched", () => {
    expect(resolvePhotoUrl("/photos/jane.jpg")).toBe("/photos/jane.jpg");
  });
});
