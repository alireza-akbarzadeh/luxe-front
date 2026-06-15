'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import { getInfiniteStoreProductsQueryOptions } from '../lib/infinite-store-products-query';
import type { StoreProductsCatalogParams } from '../lib/store-products.utils';

export {
  getInfiniteStoreProductsQueryKey,
  getInfiniteStoreProductsQueryOptions,
  STORE_PRODUCTS_PAGE_SIZE
} from '../lib/infinite-store-products-query';

/** Infinite-scroll products for a single store detail page. */
export function useInfiniteStoreProducts(slug: string, baseParams: StoreProductsCatalogParams) {
  return useInfiniteQuery({
    ...getInfiniteStoreProductsQueryOptions(slug, baseParams),
    staleTime: 60_000,
    retry: 1
  });
}
