/** Compact shareable cart line (product + qty + optional variants). */
export type CartShareLine = {
  id: number;
  q: number;
  c?: string;
  s?: string;
};

export type CartSharePayload = {
  v: 1;
  items: CartShareLine[];
};

export type CartShareSourceItem = {
  product_id?: number;
  quantity?: number;
  selected_color?: string;
  selected_size?: string;
};

export const CART_SHARE_QUERY_KEY = 'share';
export const CART_SHARE_MAX_ITEMS = 50;

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

function normalizeLine(raw: Partial<CartShareLine>): CartShareLine | null {
  if (typeof raw.id !== 'number' || !Number.isInteger(raw.id) || raw.id <= 0) return null;
  const quantity = typeof raw.q === 'number' && Number.isInteger(raw.q) ? raw.q : 1;
  if (quantity <= 0) return null;

  const line: CartShareLine = {
    id: raw.id,
    q: Math.min(quantity, 99)
  };
  if (typeof raw.c === 'string' && raw.c.trim()) line.c = raw.c.trim();
  if (typeof raw.s === 'string' && raw.s.trim()) line.s = raw.s.trim();
  return line;
}

/** Map cart API items into a shareable payload. */
export function cartItemsToShareLines(items: CartShareSourceItem[]): CartShareLine[] {
  const lines: CartShareLine[] = [];
  for (const item of items) {
    const line = normalizeLine({
      id: item.product_id,
      q: item.quantity ?? 1,
      c: item.selected_color,
      s: item.selected_size
    });
    if (!line) continue;
    lines.push(line);
    if (lines.length >= CART_SHARE_MAX_ITEMS) break;
  }
  return lines;
}

/** Encode cart lines into a portable share code. */
export function encodeCartShare(items: CartShareSourceItem[]): string | null {
  const lines = cartItemsToShareLines(items);
  if (lines.length === 0) return null;
  const payload: CartSharePayload = { v: 1, items: lines };
  return toBase64Url(JSON.stringify(payload));
}

/** Decode a share code into cart lines. Returns null when invalid. */
export function decodeCartShare(code: string): CartShareLine[] | null {
  const trimmed = code.trim();
  if (!trimmed) return null;

  try {
    const parsed = JSON.parse(fromBase64Url(trimmed)) as Partial<CartSharePayload>;
    if (parsed.v !== 1 || !Array.isArray(parsed.items)) return null;

    const lines: CartShareLine[] = [];
    for (const raw of parsed.items) {
      if (!raw || typeof raw !== 'object') continue;
      const line = normalizeLine(raw as Partial<CartShareLine>);
      if (!line) continue;
      lines.push(line);
      if (lines.length >= CART_SHARE_MAX_ITEMS) break;
    }
    return lines.length > 0 ? lines : null;
  } catch {
    return null;
  }
}

/**
 * Accepts a raw share code or a full `/cart?share=…` URL and returns the code.
 */
export function extractCartShareCode(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed);
    const fromQuery = url.searchParams.get(CART_SHARE_QUERY_KEY);
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

/** Build an absolute cart share URL for the current origin. */
export function buildCartShareUrl(code: string, origin = globalThis.location?.origin): string {
  const base = origin?.replace(/\/$/u, '') || '';
  return `${base}/cart?${CART_SHARE_QUERY_KEY}=${encodeURIComponent(code)}`;
}

/** Parse pasted input into cart lines, or null if invalid. */
export function parseCartShareInput(input: string): CartShareLine[] | null {
  const code = extractCartShareCode(input);
  if (!code) return null;
  return decodeCartShare(code);
}
