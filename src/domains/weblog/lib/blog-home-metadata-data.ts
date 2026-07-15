import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { cache } from 'react';

import { getBlogHomepage } from '@/services/-blog-homepage-get';
import type { DtoBlogHomepageData } from '@/services/-blog-homepage-get.schemas';

export interface BlogHomePagePayload {
  data: DtoBlogHomepageData;
}

export const getBlogHomePageData = cache(async (): Promise<BlogHomePagePayload | null> => {
  const cookieStore = await cookies();

  try {
    const response = await getBlogHomepage({
      headers: {
        Cookie: cookieStore.toString()
      }
    });

    if (!response.data) {
      return null;
    }

    return {
      data: response.data
    };
  } catch {
    return null;
  }
});

export function buildBlogHomeMetadata(data: DtoBlogHomepageData): Metadata {
  const featured = data.featured;

  const title = 'Luxe Blog';

  const description =
    featured?.excerpt ??
    'Read buying guides, product reviews, comparisons, tutorials and industry news from Luxe.';

  return {
    title,
    description,

    alternates: {
      canonical: '/weblog'
    },

    openGraph: {
      title,
      description,
      url: '/weblog',
      type: 'website',
      siteName: 'Luxe',

      images: featured?.hero_image_url
        ? [
            {
              url: featured.hero_image_url,
              alt: featured.hero_image_alt ?? featured.title
            }
          ]
        : undefined
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: featured?.hero_image_url ? [featured.hero_image_url] : undefined
    },

    robots: {
      index: true,
      follow: true
    }
  };
}
