'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import { getInfiniteProductsQueryOptions } from '../lib/infinite-products-query';
import type { ProductsCatalogParams } from '../lib/products.utils';

export {
  getInfiniteProductsQueryKey,
  getInfiniteProductsQueryOptions,
  PRODUCTS_PAGE_SIZE
} from '../lib/infinite-products-query';

/**
 * Infinite-scroll product catalog — wraps Orval `getProducts` with TanStack infinite query.
 * Filter params belong in `baseParams`; offset/limit are managed internally.
 */
export function useInfiniteProducts(baseParams: ProductsCatalogParams) {
  return useInfiniteQuery({
    ...getInfiniteProductsQueryOptions(baseParams),
    staleTime: 60_000,
    retry: 1
  });
}
