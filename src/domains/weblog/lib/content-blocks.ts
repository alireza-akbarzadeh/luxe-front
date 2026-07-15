import type { DtoBlogContentBlock } from '@/services/-blog-posts-{slug}-get.schemas';

/**
 * Canonical content-block model for blog articles.
 *
 * The API stores blocks as free-form JSON (`map[string]interface{}`), so this
 * module is the single source of truth for the block shapes the reader renders
 * and the (future) admin editor produces. Every parser is defensive: malformed
 * or unknown blocks resolve to `null` and are skipped rather than throwing.
 */

export type CalloutTone = 'info' | 'tip' | 'success' | 'warning';
export type ListStyle = 'unordered' | 'ordered' | 'task';

export interface ParagraphBlock {
  type: 'paragraph';
  text: string;
}

export interface HeadingBlock {
  type: 'heading';
  /** Rendered as h2–h4; anchors the table of contents. */
  level: 2 | 3 | 4;
  text: string;
  id: string;
}

export interface ImageBlock {
  type: 'image';
  url: string;
  alt: string;
  caption?: string;
}

export interface GalleryImage {
  url: string;
  alt: string;
  caption?: string;
}

export interface GalleryBlock {
  type: 'gallery';
  images: GalleryImage[];
}

export interface QuoteBlock {
  type: 'quote';
  text: string;
  cite?: string;
}

export interface ListItem {
  text: string;
  checked?: boolean;
}

export interface ListBlock {
  type: 'list';
  style: ListStyle;
  items: ListItem[];
}

export interface CodeBlock {
  type: 'code';
  code: string;
  language?: string;
}

export interface CalloutBlock {
  type: 'callout';
  tone: CalloutTone;
  title?: string;
  text: string;
}

export interface DividerBlock {
  type: 'divider';
}

export interface EmbedBlock {
  type: 'embed';
  url: string;
  title?: string;
}

export interface ProductBlock {
  type: 'product';
  productId: number;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqBlock {
  type: 'faq';
  items: FaqItem[];
}

export interface ProsConsBlock {
  type: 'pros_cons';
  pros: string[];
  cons: string[];
}

export interface TableBlock {
  type: 'table';
  headers: string[];
  rows: string[][];
}

export interface CtaBlock {
  type: 'cta';
  label: string;
  href: string;
}

export type BlogBlock =
  | ParagraphBlock
  | HeadingBlock
  | ImageBlock
  | GalleryBlock
  | QuoteBlock
  | ListBlock
  | CodeBlock
  | CalloutBlock
  | DividerBlock
  | EmbedBlock
  | ProductBlock
  | FaqBlock
  | ProsConsBlock
  | TableBlock
  | CtaBlock;

// --- primitive readers -------------------------------------------------------

type RawBlock = Record<string, unknown>;

function str(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function firstString(raw: RawBlock, ...keys: string[]): string {
  for (const key of keys) {
    const value = raw[key];
    if (typeof value === 'string' && value.length > 0) return value;
  }
  return '';
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(str).filter((item) => item.length > 0);
}

/** Deterministic slug for heading anchors so TOC links stay stable across renders. */
export function slugifyHeading(text: string, index: number): string {
  const base = text
    .toLowerCase()
    .replace(/[^\da-z]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return base ? `${base}-${index}` : `section-${index}`;
}

function parseListItems(value: unknown): ListItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item): ListItem | null => {
      if (typeof item === 'string') return { text: item };
      if (item && typeof item === 'object') {
        const raw = item as RawBlock;
        const text = firstString(raw, 'text', 'label', 'content');
        if (!text) return null;
        return { text, checked: typeof raw['checked'] === 'boolean' ? raw['checked'] : undefined };
      }
      return null;
    })
    .filter((item): item is ListItem => item !== null);
}

function parseTableRows(value: unknown): string[][] {
  if (!Array.isArray(value)) return [];
  return value.map((row) => stringArray(row)).filter((row) => row.length > 0);
}

/** Normalize one raw JSON block into a typed block, or `null` when unusable. */
export function parseBlock(raw: DtoBlogContentBlock, index: number): BlogBlock | null {
  const block = raw as RawBlock;
  const type = str(block['type']).toLowerCase();

  switch (type) {
    case 'paragraph':
    case 'text': {
      const text = firstString(block, 'text', 'content');
      return text ? { type: 'paragraph', text } : null;
    }
    case 'heading': {
      const text = firstString(block, 'text', 'content');
      if (!text) return null;
      const rawLevel = Number(block['level']);
      const level = rawLevel >= 2 && rawLevel <= 4 ? (rawLevel as 2 | 3 | 4) : 2;
      return { type: 'heading', level, text, id: slugifyHeading(text, index) };
    }
    case 'image': {
      const url = firstString(block, 'url', 'src', 'image_url');
      if (!url) return null;
      return {
        type: 'image',
        url,
        alt: firstString(block, 'alt', 'caption') || 'Article image',
        caption: firstString(block, 'caption') || undefined
      };
    }
    case 'gallery': {
      const rawImages = Array.isArray(block['images']) ? block['images'] : [];
      const images = rawImages
        .map((item): GalleryImage | null => {
          const img = (item ?? {}) as RawBlock;
          const url = firstString(img, 'url', 'src', 'image_url');
          if (!url) return null;
          return {
            url,
            alt: firstString(img, 'alt', 'caption') || 'Gallery image',
            caption: firstString(img, 'caption') || undefined
          };
        })
        .filter((img): img is GalleryImage => img !== null);
      return images.length > 0 ? { type: 'gallery', images } : null;
    }
    case 'quote':
    case 'blockquote': {
      const text = firstString(block, 'text', 'content', 'quote');
      if (!text) return null;
      return { type: 'quote', text, cite: firstString(block, 'cite', 'author') || undefined };
    }
    case 'list': {
      const items = parseListItems(block['items']);
      if (items.length === 0) return null;
      const style = str(block['style']).toLowerCase();
      const resolved: ListStyle =
        style === 'ordered' ? 'ordered' : style === 'task' ? 'task' : 'unordered';
      return { type: 'list', style: resolved, items };
    }
    case 'code': {
      const code = firstString(block, 'code', 'content', 'text');
      if (!code) return null;
      return { type: 'code', code, language: firstString(block, 'language', 'lang') || undefined };
    }
    case 'callout': {
      const text = firstString(block, 'text', 'content');
      if (!text) return null;
      const tone = str(block['tone'] ?? block['variant']).toLowerCase();
      const resolved: CalloutTone =
        tone === 'warning'
          ? 'warning'
          : tone === 'success'
            ? 'success'
            : tone === 'tip'
              ? 'tip'
              : 'info';
      return {
        type: 'callout',
        tone: resolved,
        title: firstString(block, 'title') || undefined,
        text
      };
    }
    case 'divider':
    case 'hr':
      return { type: 'divider' };
    case 'embed':
    case 'video':
    case 'youtube': {
      const url = firstString(block, 'url', 'src');
      if (!url) return null;
      return { type: 'embed', url, title: firstString(block, 'title') || undefined };
    }
    case 'product': {
      const productId = Number(block['product_id'] ?? block['productId'] ?? block['id']);
      return Number.isFinite(productId) && productId > 0 ? { type: 'product', productId } : null;
    }
    case 'faq': {
      const rawItems = Array.isArray(block['items']) ? block['items'] : [];
      const items = rawItems
        .map((item): FaqItem | null => {
          const faq = (item ?? {}) as RawBlock;
          const question = firstString(faq, 'question', 'q', 'title');
          const answer = firstString(faq, 'answer', 'a', 'content');
          return question && answer ? { question, answer } : null;
        })
        .filter((item): item is FaqItem => item !== null);
      return items.length > 0 ? { type: 'faq', items } : null;
    }
    case 'pros_cons':
    case 'proscons': {
      const pros = stringArray(block['pros']);
      const cons = stringArray(block['cons']);
      return pros.length > 0 || cons.length > 0 ? { type: 'pros_cons', pros, cons } : null;
    }
    case 'table': {
      const headers = stringArray(block['headers']);
      const rows = parseTableRows(block['rows']);
      return rows.length > 0 ? { type: 'table', headers, rows } : null;
    }
    case 'cta':
    case 'button': {
      const label = firstString(block, 'label', 'text');
      const href = firstString(block, 'href', 'url');
      return label && href ? { type: 'cta', label, href } : null;
    }
    default:
      return null;
  }
}

/** Parse and filter an article's raw block list into renderable blocks. */
export function parseBlocks(raw: DtoBlogContentBlock[] | undefined): BlogBlock[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((block, index) => parseBlock(block, index))
    .filter((block): block is BlogBlock => block !== null);
}

/** Heading blocks flattened for the table of contents. */
export function extractHeadings(blocks: BlogBlock[]): HeadingBlock[] {
  return blocks.filter((block): block is HeadingBlock => block.type === 'heading');
}

/** All FAQ pairs across the article (used for FAQPage structured data). */
export function extractFaqs(blocks: BlogBlock[]): FaqItem[] {
  return blocks
    .filter((block): block is FaqBlock => block.type === 'faq')
    .flatMap((block) => block.items);
}
