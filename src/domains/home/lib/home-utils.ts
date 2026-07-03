import type { Locale } from '@/i18n/config';
import { formatLocaleCurrency } from '@/lib/i18n/format-number';
import type { DtoHomeCategoryItem } from '@/services/-home-categories-get.schemas';
import type { DtoHomeProductItem } from '@/services/-home-top-products-get.schemas';
import type { DtoProductWithLike } from '@/services/-products-get.schemas';
import type { ModelsCategory, ModelsProduct } from '~/src/services/-categories-get.schemas';

import { CATEGORY_IMAGES, FALLBACK_CATEGORY_IMAGES } from './home-mock-data';

export function getCategoryImage(category: ModelsCategory, index: number): string {
  const slug = category.slug?.toLowerCase() ?? '';
  const name = category.name?.toLowerCase() ?? '';

  for (const key of Object.keys(CATEGORY_IMAGES)) {
    if (key !== 'default' && (slug.includes(key) || name.includes(key))) {
      return CATEGORY_IMAGES[key as keyof typeof CATEGORY_IMAGES];
    }
  }

  return FALLBACK_CATEGORY_IMAGES[index % FALLBACK_CATEGORY_IMAGES.length]!;
}

/** Resolves display image for a homepage category card from API or fallback pool. */
export function getHomeCategoryImage(item: DtoHomeCategoryItem, index: number): string {
  if (item.image_url) {
    return item.image_url;
  }
  return getCategoryImage(
    {
      id: item.id,
      name: item.name ?? '',
      slug: item.slug ?? '',
      description: item.description
    },
    index
  );
}

export function mapProductForCard(item: DtoProductWithLike) {
  const product = item;
  return {
    id: product?.id,
    name: product?.name ?? 'Product',
    slug: product?.slug ?? `product-${product?.id ?? 'unknown'}`,
    sku: product?.sku ?? `SKU-${product?.id ?? 'unknown'}`,
    price: product?.price ?? 0,
    compare_at_price: product?.compare_at_price,
    rating: product?.rating,
    reviews_count: product?.reviews_count,
    is_new: product?.is_new,
    images: product?.images,
    category: product?.category,
    status: product?.status as ModelsProduct['status'],
    isLike: item.is_liked ?? false
  };
}

/** Maps a homepage product DTO to the shape expected by `ProductCard`. */
export function mapHomeProductItem(item: DtoHomeProductItem) {
  return mapProductForCard({ ...item, is_liked: false });
}

export function formatPrice(value?: number, locale: Locale = 'en'): string {
  if (value === undefined || Number.isNaN(value)) {
    return formatLocaleCurrency(0, locale);
  }
  return formatLocaleCurrency(value, locale);
}

/** Break out of parent padding for full-bleed sections */
export const fullBleedClass = 'relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2';

/** Aligned content width for home sections and other full-width bands. */
export const sectionContainerClass = 'app-container';
