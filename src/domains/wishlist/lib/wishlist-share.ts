/** Compact shareable wishlist payload (product IDs only). */
export type WishlistSharePayload = {
  v: 1;
  ids: number[];
};

export const WISHLIST_SHARE_QUERY_KEY = 'share';
export const WISHLIST_SHARE_MAX_IDS = 50;

function toBase64Url(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/u, '');
}

function fromBase64Url(value: string): string {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  const padLength = (4 - (padded.length % 4)) % 4;
  const normalized = padded + '='.repeat(padLength);
  const binary = atob(normalized);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function uniquePositiveIds(ids: number[]): number[] {
  const seen = new Set<number>();
  const result: number[] = [];
  for (const id of ids) {
    if (!Number.isInteger(id) || id <= 0 || seen.has(id)) continue;
    seen.add(id);
    result.push(id);
    if (result.length >= WISHLIST_SHARE_MAX_IDS) break;
  }
  return result;
}

/** Encode product IDs into a portable wishlist share code. */
export function encodeWishlistShare(ids: number[]): string | null {
  const uniqueIds = uniquePositiveIds(ids);
  if (uniqueIds.length === 0) return null;

  const payload: WishlistSharePayload = { v: 1, ids: uniqueIds };
  return toBase64Url(JSON.stringify(payload));
}

/** Decode a share code into product IDs. Returns null when invalid. */
export function decodeWishlistShare(code: string): number[] | null {
  const trimmed = code.trim();
  if (!trimmed) return null;

  try {
    const parsed = JSON.parse(fromBase64Url(trimmed)) as Partial<WishlistSharePayload>;
    if (parsed.v !== 1 || !Array.isArray(parsed.ids)) return null;
    const ids = uniquePositiveIds(parsed.ids.filter((id): id is number => typeof id === 'number'));
    return ids.length > 0 ? ids : null;
  } catch {
    return null;
  }
}

/**
 * Accepts a raw share code or a full `/wishlist?share=…` URL and returns the code.
 */
export function extractWishlistShareCode(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed);
    const fromQuery = url.searchParams.get(WISHLIST_SHARE_QUERY_KEY);
    if (fromQuery) return fromQuery.trim() || null;
  } catch {
    // Not a URL — treat as code.
  }

  const match = trimmed.match(/[?&]share=([^&#]+)/i);
  if (match?.[1]) {
    try {
      return decodeURIComponent(match[1]);
    } catch {
      return match[1];
    }
  }

  return trimmed;
}

/** Build an absolute share URL for the current origin. */
export function buildWishlistShareUrl(code: string, origin = globalThis.location?.origin): string {
  const base = origin?.replace(/\/$/u, '') || '';
  return `${base}/wishlist?${WISHLIST_SHARE_QUERY_KEY}=${encodeURIComponent(code)}`;
}

/** Parse pasted input into product IDs, or null if invalid. */
export function parseWishlistShareInput(input: string): number[] | null {
  const code = extractWishlistShareCode(input);
  if (!code) return null;
  return decodeWishlistShare(code);
}
