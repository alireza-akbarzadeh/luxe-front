import type { CuratedCollection } from '@/domains/collections/lib/collections.config';
import type { DtoCollectionResponse } from '@/services/-collections-get.schemas';
import type { GetProductsSort } from '@/services/-products-get.schemas';

/** Maps API collection rows to storefront curated collection cards. */
export function mapApiCollectionToCurated(collection: DtoCollectionResponse): CuratedCollection {
  return {
    id: collection.slug ?? String(collection.id ?? ''),
    eyebrow: collection.eyebrow ?? '',
    title: collection.title ?? '',
    description: collection.description ?? '',
    href: collection.href ?? '/shop',
    image: collection.image_url ?? '',
    cta: collection.cta_label ?? 'Shop collection',
    previewParams: {
      sort: (collection.preview_sort as GetProductsSort | undefined) || undefined,
      is_new: collection.preview_is_new,
      category_id: collection.preview_category_id
    }
  };
}
