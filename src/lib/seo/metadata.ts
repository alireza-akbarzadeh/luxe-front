import type { Metadata } from 'next';

import { BRAND_ASSETS } from '@/lib/brand-assets';
import { absoluteUrl } from '@/lib/seo/site-url';

export interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string;
  /** Defaults to true for public storefront pages. */
  index?: boolean;
  openGraphType?: 'website' | 'article';
}

/** Shared metadata builder for static and dynamic storefront routes. */
export function buildPageMetadata({
  title,
  description,
  path,
  image,
  keywords,
  index = true,
  openGraphType = 'website'
}: PageMetadataInput): Metadata {
  const canonicalPath = path.startsWith('/') ? path : `/${path}`;

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: {
      canonical: canonicalPath
    },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      type: openGraphType,
      siteName: 'Luxe',
      ...(image
        ? {
            images: [
              {
                url: image,
                alt: title
              }
            ]
          }
        : {})
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(image ? { images: [image] } : {})
    },
    robots: {
      index,
      follow: true
    }
  };
}

/** Metadata for authenticated, transactional, or duplicate thin pages. */
export function noIndexMetadata(title: string, description?: string): Metadata {
  return {
    title,
    ...(description ? { description } : {}),
    robots: {
      index: false,
      follow: false
    }
  };
}

export function organizationJsonLd(): Record<string, unknown> {
  const siteUrl = absoluteUrl('/');

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Luxe',
    url: siteUrl,
    logo: absoluteUrl(BRAND_ASSETS.logo),
    sameAs: []
  };
}

export function websiteJsonLd(): Record<string, unknown> {
  const siteUrl = absoluteUrl('/');

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Luxe',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
}
