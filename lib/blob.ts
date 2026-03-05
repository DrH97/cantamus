/**
 * Resolve a scoreUrl for client display.
 * Local URLs (/scores/...) pass through unchanged.
 * Vercel Blob URLs get a temporary signed download URL.
 */
export async function resolveScoreUrl(
  url: string | null,
): Promise<string | null> {
  if (!url) return null;
  if (url.startsWith("/")) return url;

  try {
    const { getDownloadUrl } = await import("@vercel/blob");
    return await getDownloadUrl(url);
  } catch {
    return url;
  }
}
