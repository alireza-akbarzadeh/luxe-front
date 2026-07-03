import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { cache } from 'react';

import type { DtoProductWithLike } from '@/services/-products-get.schemas';
import { getProductsId } from '~/src/services/-products-{id}-get';

export interface ProductPagePayload {
  product: DtoProductWithLike;
  isLiked: boolean;
}

/** Server-side product fetch for PDP route + metadata (deduped per request). */
export const getProductPageData = cache(
  async (param: string): Promise<ProductPagePayload | null> => {
    const cookieStore = await cookies();

    try {
      const response = await getProductsId(param, {
        headers: { Cookie: cookieStore.toString() }
      });
      const product = response.data?.product;
      if (!product) return null;

      return {
        product,
        isLiked: response.data?.is_liked ?? false
      };
    } catch {
      return null;
    }
  }
);

export function buildProductMetadata(product: DtoProductWithLike, slug: string): Metadata {
  const title = product.meta_title?.trim() || product.name || 'Product';
  const description =
    product.meta_description?.trim() ||
    product.description?.replace(/\s+/g, ' ').trim().slice(0, 160) ||
    `Shop ${product.name ?? 'this product'} at Luxe.`;

  const canonicalPath = `/product/${slug}`;
  const image = product.images?.[0];
  const keywords = product.tags?.length ? product.tags.join(', ') : undefined;

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
      type: 'website' as const,
      siteName: 'Luxe',
      ...(image
        ? {
            images: [
              {
                url: image,
                alt: product.name ?? title
              }
            ]
          }
        : {})
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(image ? { images: [image] } : {})
    },
    robots: {
      index: product.status === 'active' && product.visibility !== 'private',
      follow: true
    }
  };
}
