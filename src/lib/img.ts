// The seed data references local placeholder files (`/placeholder-listing-*.jpg`,
// `/placeholder-avatar-*.jpg`) that were never committed to `public/`. Until real
// assets exist, resolve those dead paths to a deterministic stock photo so the
// storefront and detail galleries render actual images. Real (http/external) URLs
// and already-existing public assets pass through unchanged.

export function resolveImg(
  url: string | null | undefined,
  w = 800,
  h = 600
): string {
  if (!url || url.startsWith("/placeholder")) {
    const seed = (url ?? "propview").replace(/[^a-z0-9]/gi, "") || "propview";
    return `https://picsum.photos/seed/${seed}/${w}/${h}`;
  }
  return url;
}
