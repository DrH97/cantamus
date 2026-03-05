/**
 * Resolve a scoreUrl for client display.
 * Local URLs (/scores/...) pass through unchanged.
 * Vercel Blob URLs get rewritten to the proxy route /api/scores?pathname=...
 */
export function resolveScoreUrl(url: string | null): string | null {
  if (!url) return null;
  if (url.startsWith("/")) return url;

  // Private blob URL — rewrite to our streaming proxy
  try {
    const blobUrl = new URL(url);
    return `/api/scores?pathname=${encodeURIComponent(blobUrl.pathname.slice(1))}`;
  } catch {
    return url;
  }
}
