'use client';

import { useInfiniteQuery } from '@tanstack/react-query';

import type { StoresCatalogParams } from '../lib/stores.utils';
import { getInfiniteStoresQueryOptions } from '../lib/infinite-stores-query';

export {
  getInfiniteStoresQueryKey,
  getInfiniteStoresQueryOptions,
  STORES_PAGE_SIZE
} from '../lib/infinite-stores-query';

/** Infinite-scroll store listing — offset/limit managed internally. */
export function useInfiniteStores(baseParams: StoresCatalogParams) {
  return useInfiniteQuery({
    ...getInfiniteStoresQueryOptions(baseParams),
    staleTime: 60_000,
    retry: 1
  });
}
