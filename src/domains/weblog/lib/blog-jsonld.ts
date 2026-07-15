import { absoluteUrl } from '@/lib/seo/site-url';
import type { DtoBlogPostResponse } from '@/services/-blog-posts-{slug}-get.schemas';

import type { FaqItem } from './content-blocks';

type JsonLd = Record<string, unknown>;

/** Article structured data (schema.org/Article) for a blog post. */
export function buildArticleJsonLd(post: DtoBlogPostResponse): JsonLd {
  const url = absoluteUrl(`/blog/${post.slug ?? ''}`);

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: post.meta_title?.trim() || post.title,
    description: post.meta_description?.trim() || post.excerpt,
    image: post.hero_image_url ? [post.hero_image_url] : undefined,
    datePublished: post.published_at,
    dateModified: post.content_updated_at || post.published_at,
    author: post.author?.name
      ? { '@type': 'Person', name: post.author.name, jobTitle: post.author.role || undefined }
      : { '@type': 'Organization', name: 'Luxe' },
    publisher: {
      '@type': 'Organization',
      name: 'Luxe',
      logo: { '@type': 'ImageObject', url: absoluteUrl('/og-image.png') }
    },
    articleSection: post.category?.name || undefined,
    keywords:
      post.tags
        ?.map((tag) => tag.name)
        .filter(Boolean)
        .join(', ') || undefined,
    wordCount: undefined
  };
}

export interface BreadcrumbEntry {
  name: string;
  path: string;
}

/** Breadcrumb structured data (schema.org/BreadcrumbList). */
export function buildBreadcrumbJsonLd(entries: BreadcrumbEntry[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: entries.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.name,
      item: absoluteUrl(entry.path)
    }))
  };
}

/** FAQ structured data (schema.org/FAQPage) — only emit when FAQs exist. */
export function buildFaqJsonLd(faqs: FaqItem[]): JsonLd | null {
  if (faqs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer }
    }))
  };
}
