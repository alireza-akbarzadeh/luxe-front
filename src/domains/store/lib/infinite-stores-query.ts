import { getGetStoresQueryKey, getStores } from '@/services/-stores-get';

import { normalizeStoresCatalogParams, type StoresCatalogParams } from './stores.utils';

export const STORES_PAGE_SIZE = 24;

export function getInfiniteStoresQueryKey(baseParams: StoresCatalogParams = {}) {
  const normalized = normalizeStoresCatalogParams(baseParams);

  return [
    ...getGetStoresQueryKey({ ...normalized, limit: STORES_PAGE_SIZE, offset: 0 }),
    'infinite'
  ] as const;
}

function getNextPageParam(
  lastPage: Awaited<ReturnType<typeof getStores>>,
  allPages: Awaited<ReturnType<typeof getStores>>[]
) {
  const loaded = allPages.reduce((sum, page) => sum + (page.data?.stores?.length ?? 0), 0);
  const total = lastPage.data?.total ?? 0;
  return loaded < total ? loaded : undefined;
}

/** Shared infinite-query options for client hooks and SSR prefetch. */
export function getInfiniteStoresQueryOptions(baseParams: StoresCatalogParams = {}) {
  const normalized = normalizeStoresCatalogParams(baseParams);

  return {
    queryKey: getInfiniteStoresQueryKey(normalized),
    queryFn: ({ pageParam, signal }: { pageParam: number; signal?: AbortSignal }) =>
      getStores(
        { ...normalized, limit: STORES_PAGE_SIZE, offset: pageParam },
        undefined,
        signal
      ),
    initialPageParam: 0,
    getNextPageParam
  };
}
