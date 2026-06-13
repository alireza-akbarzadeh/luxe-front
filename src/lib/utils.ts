/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Row } from '@tanstack/react-table';
import { type ClassValue, clsx } from 'clsx';
import type { JSX } from 'react';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

export type StringNumber = `${number}`;
export type StringBoolean = `${boolean}`;

export type ExtractUnionStrict<T, U extends T> = Extract<T, U>;
export type ExcludeUnionStrict<T, U extends T> = Exclude<T, U>;
export type LiteralUnion<T extends U, U = string> = T | (U & {});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function objectKeysTyped<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

type TryCatchResult<E = Error, T = unknown> = [null, T] | [E, null];

export function tryCatchSync<E = Error, T = unknown>(fn: () => T): TryCatchResult<E, T> {
  try {
    const data = fn();
    return [null, data];
  } catch (error) {
    return [error as E, null];
  }
}

export async function tryCatchAsync<E = Error, T = unknown>(
  promise: Promise<T>
): Promise<TryCatchResult<E, T>> {
  try {
    const data = await promise;
    return [null, data];
  } catch (error) {
    return [error as E, null];
  }
}

type ErrorUnion<T extends (new (...args: any[]) => any)[]> = T extends (new (
  ...args: any[]
) => infer U)[]
  ? U
  : never;

export function tryCatchErrorsSync<E extends (new (...args: any[]) => any)[], T>(
  fn: () => T,
  errorClasses?: E
): TryCatchResult<ErrorUnion<E>, T> {
  try {
    const data = fn();
    return [null, data];
  } catch (error) {
    if (errorClasses?.some((e) => error instanceof e)) {
      return [error as ErrorUnion<E>, null];
    } else {
      throw error;
    }
  }
}

export async function tryCatchErrorsAsync<E extends (new (...args: any[]) => any)[], T>(
  promise: Promise<T>,
  errorClasses?: E
): Promise<TryCatchResult<ErrorUnion<E>, T>> {
  try {
    const data = await promise;
    return [null, data];
  } catch (error) {
    if (errorClasses?.some((e) => error instanceof e)) {
      return [error as ErrorUnion<E>, null];
    } else {
      throw error;
    }
  }
}

type Meta = JSX.IntrinsicElements['meta'];

type ViewportWidthHeightValues = StringNumber | 'device-width' | 'device-height';

interface Viewport {
  width?: ViewportWidthHeightValues;
  height?: ViewportWidthHeightValues;
  'initial-scale'?: StringNumber;
  'minimum-scale'?: StringNumber;
  'maximum-scale'?: StringNumber;
  'user-scalable'?: 'yes' | 'no' | '1' | '0';
  'viewport-fit'?: 'auto' | 'contain' | 'cover';
  [key: string]: unknown;
}

interface ImageMetadata {
  width?: number;
  height?: number;
  url?: string;
  alt?: string;
  format?: LiteralUnion<'jpg' | 'png' | 'webp' | 'gif', string>;
}

type OpenGraphType = 'website' | 'article' | 'book' | 'profile' | 'product' | 'place' | 'event';
type TwitterCard = 'summary' | 'summary_large_image';

export interface SiteMetaInput {
  charSet?: LiteralUnion<'utf-8', string>;
  title?: string;
  description?: string;
  viewport?: Viewport;
  author?: string;
  robots?: string;
  keywords?: string;
  images?: ImageMetadata[];
  openGraph?: {
    url?: string;
    siteName?: string;
    type?: OpenGraphType; // Changed from LiteralUnion to specific type
    locale?: string;
  };
  twitter?: {
    site?: string;
    creator?: string;
    card?: TwitterCard;
  };
}

export function createMetadata(metadata: SiteMetaInput): Meta[] {
  const meta: Meta[] = [];

  if (metadata.charSet) {
    meta.push({ charSet: metadata.charSet });
  }

  if (metadata.title) {
    meta.push({ title: metadata.title });
  }

  if (metadata.viewport) {
    const viewport = Object.entries(metadata.viewport)
      .map(([key, value]) => `${key}=${value}`)
      .join(', ');

    meta.push({ name: 'viewport', content: viewport });
  }

  addMetaTag('name', 'description', metadata.description);
  addMetaTag('name', 'author', metadata.author);
  addMetaTag('name', 'robots', metadata.robots);
  addMetaTag('name', 'keywords', metadata.keywords);

  addMetaTag('property', 'og:title', metadata.title);
  addMetaTag('property', 'og:description', metadata.description);
  addMetaTag('property', 'og:url', metadata?.openGraph?.url);
  addMetaTag('property', 'og:site_name', metadata?.openGraph?.siteName);
  addMetaTag('property', 'og:type', metadata?.openGraph?.type);
  addMetaTag('property', 'og:locale', metadata?.openGraph?.locale);

  addMetaTag('name', 'twitter:card', metadata?.twitter?.card);
  addMetaTag('name', 'twitter:site', metadata?.twitter?.site);
  addMetaTag('name', 'twitter:creator', metadata?.twitter?.creator);
  addMetaTag('name', 'twitter:title', metadata.title);
  addMetaTag('name', 'twitter:description', metadata.description);

  addMetaTag('name', 'twitter:image', metadata.images?.[0]?.url);
  addMetaTag('name', 'twitter:image:alt', metadata.images?.[0]?.alt);
  addMetaTag('name', 'twitter:image:width', metadata.images?.[0]?.width?.toString());
  addMetaTag('name', 'twitter:image:height', metadata.images?.[0]?.height?.toString());

  for (const image of metadata?.images || []) {
    addMetaTag('property', 'og:image', image.url);
    addMetaTag('property', 'og:image:alt', image.alt);
    addMetaTag('property', 'og:image:type', image.format);
    addMetaTag('property', 'og:image:width', image.width?.toString());
    addMetaTag('property', 'og:image:height', image.height?.toString());
  }

  function addMetaTag(keyType: 'name' | 'property', keyName: string, content?: string) {
    if (typeof content === 'string' && content?.trim() !== '') {
      meta.push({ [keyType]: keyName, content });
    }
  }

  return meta;
}

export function toNextMetadata(
  metadata: SiteMetaInput,
  options?: { metadataBase?: URL; category?: string }
): import('next').Metadata {
  const ogImages =
    metadata.images
      ?.filter((image) => image.url)
      .map((image) => ({
        url: image.url!,
        width: image.width,
        height: image.height,
        alt: image.alt,
        type: image.format as 'jpg' | 'png' | 'webp' | 'gif' | undefined
      })) ?? [];

  const primaryImage = metadata.images?.[0];

  return {
    ...(options?.metadataBase ? { metadataBase: options.metadataBase } : {}),
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    ...(metadata.author ? { authors: [{ name: metadata.author }] } : {}),
    ...(metadata.robots ? { robots: metadata.robots } : {}),
    ...(options?.category ? { category: options.category } : {}),
    openGraph: {
      title: metadata.title ?? '',
      description: metadata.description ?? '',
      url: metadata.openGraph?.url ?? '',
      siteName: metadata.openGraph?.siteName ?? '',
      type: 'website',
      locale: metadata.openGraph?.locale ?? '',
      images: ogImages
    },
    twitter: {
      card: metadata.twitter?.card ?? 'summary_large_image',
      site: metadata.twitter?.site ?? '',
      creator: metadata.twitter?.creator,
      title: metadata.title,
      description: metadata.description,
      images: primaryImage?.url ? [primaryImage.url] : undefined
    }
  };
}

export function generateSlug(slug: string) {
  const split = slug.split(' ');
  return split.join('-').toLowerCase();
}

export function toCamelCase(value: string) {
  return value
    .replace(/[^a-z ]/gi, '')
    .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match: any, index: number) => {
      return +match === 0 ? '' : match[index === 0 ? 'toLowerCase' : 'toUpperCase']();
    });
}

export const generateIdFromObject = (obj: any) => {
  // 1. Extract values and flatten any arrays (like your coordinates)
  // 2. Filter out non-primitive values or stringify them
  // 3. Join them with a delimiter to create a "seed" string
  const seed = Object.values(obj)
    .map((value) => (Array.isArray(value) ? value.join('-') : String(value)))
    .join('|');

  // 4. Create a simple hash (djb2 algorithm) to keep the ID clean and short
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }

  return `id_${Math.abs(hash).toString(36)}`;
};

export function downloadCSV<TData>(rows: Row<TData>[], filename: string): boolean {
  try {
    const data = rows.map((row) => row.original);
    if (data.length === 0) return false;

    const headers = Object.keys(data[0] as object).join(',');
    const csvRows = data.map((item) =>
      Object.values(item as object)
        .map((val) => {
          const stringVal = val === null || val === undefined ? '' : String(val);
          return `"${stringVal.replace(/"/g, '""')}"`;
        })
        .join(',')
    );

    const csvContent = [headers, ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return true; // Success
  } catch (error) {
    console.error('CSV Export failed', error);
    return false;
  }
}

// Helper functions
export const formatDuration = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const formatViews = (views: number): string => {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M views`;
  }
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K views`;
  }
  return `${views} views`;
};

export const formatPayerTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const getEmailProviderLink = (email: string, isSpam: boolean) => {
  const domain = email.split('@')[1]?.toLowerCase();

  if (domain === 'gmail.com') {
    return isSpam
      ? 'https://mail.google.com/mail/u/0/#spam'
      : 'https://mail.google.com/mail/u/0/#inbox';
  }

  if (domain === 'outlook.com' || domain === 'hotmail.com' || domain === 'live.com') {
    return isSpam
      ? 'https://outlook.live.com/mail/0/junkemail'
      : 'https://outlook.live.com/mail/0/inbox';
  }

  if (domain === 'yahoo.com') {
    return isSpam ? 'https://mail.yahoo.com/d/folders/2' : 'https://mail.yahoo.com';
  }

  // Default fallback if unknown
  return 'https://mail.google.com';
};

export const getCurrentUrl = () => {
  if (typeof window === 'undefined') return '';
  return window.location.href;
};

export function getCallbackeUrl(callbackUrl?: string | null): string {
  if (!callbackUrl) return '/account';

  try {
    const url = new URL(
      callbackUrl,
      `http://${process.env['NEXT_PUBLIC_APP_DOMAIN'] || 'localhost'}`
    );
    const allowed =
      url.origin === (process.env['NEXT_PUBLIC_APP_ORIGIN'] || 'http://localhost:4000');
    if (allowed) return url.pathname + url.search;
  } catch {
    if (callbackUrl.startsWith('/')) return callbackUrl;
  }
  return '/account';
}

export const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Content-Security-Policy',
    value: `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none';`
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
];

export const copyToClipboard = async (text: string, description: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(`${description} copied to clipboard`);
  } catch {
    toast.error('Failed to copy value');
  }
};


export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
