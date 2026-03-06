function resolveBlobUrl(url: string | null, proxyPath: string): string | null {
  if (!url) return null;
  if (url.startsWith("/")) return url;

  // Private blob URL — rewrite to our streaming proxy
  try {
    const blobUrl = new URL(url);
    return `${proxyPath}?pathname=${encodeURIComponent(blobUrl.pathname.slice(1))}`;
  } catch {
    return url;
  }
}

/**
 * Resolve a scoreUrl for client display.
 * Local URLs (/scores/...) pass through unchanged.
 * Vercel Blob URLs get rewritten to the proxy route /api/scores?pathname=...
 */
export function resolveScoreUrl(url: string | null): string | null {
  return resolveBlobUrl(url, "/api/scores");
}

/**
 * Resolve a photoUrl for client display.
 * Local URLs (/photos/...) pass through unchanged.
 * Vercel Blob URLs get rewritten to the proxy route /api/photos?pathname=...
 */
export function resolvePhotoUrl(url: string | null): string | null {
  return resolveBlobUrl(url, "/api/photos");
}
