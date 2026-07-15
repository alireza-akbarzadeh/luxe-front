import { getProductPath } from '@/domains/product/lib/product-routes';

export interface ProductLinkTarget {
  id: number;
  name: string;
  href: string;
  images?: string[];
}

export interface ProductMention {
  /** Case-preserved display is not stored; matching is case-insensitive. */
  phrase: string;
  href: string;
  productId: number;
}

export type BlogTextSegment =
  | { type: 'text'; value: string }
  | { type: 'link'; value: string; href: string };

type LinkedProductInput = {
  product?: {
    id?: number;
    name?: string | null;
    slug?: string | null;
    images?: string[] | null;
  } | null;
};

const MARKDOWN_LINK_RE = /\[([^\]]+)\]\(([^)\s]+)\)/g;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Map blog post product links into PDP targets keyed by product id. */
export function buildProductLinkTargets(
  items: LinkedProductInput[] | undefined
): ProductLinkTarget[] {
  const byId = new Map<number, ProductLinkTarget>();

  for (const item of items ?? []) {
    const product = item.product;
    const id = product?.id;
    const name = product?.name?.trim();
    if (!id || !name) continue;
    if (byId.has(id)) continue;
    byId.set(id, {
      id,
      name,
      href: getProductPath(product),
      images: product.images ?? undefined
    });
  }

  return [...byId.values()];
}

/**
 * Build mention phrases from linked products (full name + trailing-word aliases).
 * Longer phrases win when ranges overlap.
 */
export function buildProductMentions(targets: ProductLinkTarget[]): ProductMention[] {
  const byPhrase = new Map<string, ProductMention>();

  const sorted = [...targets].sort((a, b) => b.name.length - a.name.length);

  for (const target of sorted) {
    const aliases = productNameAliases(target.name);
    for (const alias of aliases) {
      const key = alias.toLowerCase();
      if (byPhrase.has(key)) continue;
      byPhrase.set(key, {
        phrase: alias,
        href: target.href,
        productId: target.id
      });
    }
  }

  return [...byPhrase.values()].sort((a, b) => b.phrase.length - a.phrase.length);
}

/** "iPhone 16 Pro Max" → ["iPhone 16 Pro Max", "iPhone 16 Pro", "iPhone 16"] (min 2 tokens). */
function productNameAliases(name: string): string[] {
  const tokens = name.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];
  if (tokens.length === 1) return [tokens[0]!];

  const aliases: string[] = [];
  for (let count = tokens.length; count >= 2; count -= 1) {
    aliases.push(tokens.slice(0, count).join(' '));
  }
  return aliases;
}

/**
 * Split article text into text + link segments.
 * Supports markdown `[label](href)` and auto-links linked product name mentions.
 */
export function segmentBlogText(text: string, mentions: ProductMention[]): BlogTextSegment[] {
  if (!text) return [];

  const withMarkdown = splitMarkdownLinks(text);
  const segments: BlogTextSegment[] = [];

  for (const part of withMarkdown) {
    if (part.type === 'link') {
      segments.push(part);
      continue;
    }
    segments.push(...linkifyProductMentions(part.value, mentions));
  }

  return mergeAdjacentText(segments);
}

function splitMarkdownLinks(text: string): BlogTextSegment[] {
  const segments: BlogTextSegment[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(MARKDOWN_LINK_RE)) {
    const full = match[0];
    const label = match[1] ?? '';
    const href = match[2] ?? '';
    const index = match.index ?? 0;
    if (!isSafeHref(href)) continue;

    if (index > lastIndex) {
      segments.push({ type: 'text', value: text.slice(lastIndex, index) });
    }
    segments.push({ type: 'link', value: label, href });
    lastIndex = index + full.length;
  }

  if (lastIndex < text.length) {
    segments.push({ type: 'text', value: text.slice(lastIndex) });
  }

  return segments.length > 0 ? segments : [{ type: 'text', value: text }];
}

function isSafeHref(href: string): boolean {
  const trimmed = href.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('/')) return true;
  if (trimmed.startsWith('https://') || trimmed.startsWith('http://')) return true;
  return false;
}

function linkifyProductMentions(text: string, mentions: ProductMention[]): BlogTextSegment[] {
  if (!text || mentions.length === 0) {
    return [{ type: 'text', value: text }];
  }

  type Hit = { start: number; end: number; href: string; value: string };
  const hits: Hit[] = [];

  for (const mention of mentions) {
    const pattern = new RegExp(
      `(?<![\\p{L}\\p{N}])${escapeRegExp(mention.phrase)}(?![\\p{L}\\p{N}])`,
      'giu'
    );
    for (const match of text.matchAll(pattern)) {
      const value = match[0] ?? '';
      const start = match.index ?? 0;
      hits.push({
        start,
        end: start + value.length,
        href: mention.href,
        value
      });
    }
  }

  if (hits.length === 0) {
    return [{ type: 'text', value: text }];
  }

  hits.sort((a, b) => a.start - b.start || b.end - a.end - (a.end - a.start));

  const chosen: Hit[] = [];
  let cursor = 0;
  for (const hit of hits) {
    if (hit.start < cursor) continue;
    chosen.push(hit);
    cursor = hit.end;
  }

  const segments: BlogTextSegment[] = [];
  let last = 0;
  for (const hit of chosen) {
    if (hit.start > last) {
      segments.push({ type: 'text', value: text.slice(last, hit.start) });
    }
    segments.push({ type: 'link', value: hit.value, href: hit.href });
    last = hit.end;
  }
  if (last < text.length) {
    segments.push({ type: 'text', value: text.slice(last) });
  }

  return segments;
}

function mergeAdjacentText(segments: BlogTextSegment[]): BlogTextSegment[] {
  const merged: BlogTextSegment[] = [];
  for (const segment of segments) {
    const prev = merged[merged.length - 1];
    if (segment.type === 'text' && prev?.type === 'text') {
      prev.value += segment.value;
      continue;
    }
    merged.push(segment);
  }
  return merged.filter((segment) => segment.type === 'link' || segment.value.length > 0);
}
