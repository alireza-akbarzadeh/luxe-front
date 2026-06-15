import {
  getGetStoresSlugProductsQueryKey,
  getStoresSlugProducts
} from '@/services/-stores-{slug}-products-get';

import {
  normalizeStoreProductsParams,
  type StoreProductsCatalogParams
} from './store-products.utils';

export const STORE_PRODUCTS_PAGE_SIZE = 24;

export function getInfiniteStoreProductsQueryKey(
  slug: string,
  baseParams: StoreProductsCatalogParams = {}
) {
  const normalized = normalizeStoreProductsParams(baseParams);

  return [
    ...getGetStoresSlugProductsQueryKey(slug, {
      ...normalized,
      limit: STORE_PRODUCTS_PAGE_SIZE,
      offset: 0
    }),
    'infinite'
  ] as const;
}

function getNextPageParam(
  lastPage: Awaited<ReturnType<typeof getStoresSlugProducts>>,
  allPages: Awaited<ReturnType<typeof getStoresSlugProducts>>[]
) {
  const loaded = allPages.reduce((sum, page) => sum + (page.data?.products?.length ?? 0), 0);
  const total = lastPage.data?.total ?? 0;
  return loaded < total ? loaded : undefined;
}

/** Shared infinite-query options for store product grids. */
export function getInfiniteStoreProductsQueryOptions(
  slug: string,
  baseParams: StoreProductsCatalogParams = {}
) {
  const normalized = normalizeStoreProductsParams(baseParams);

  return {
    queryKey: getInfiniteStoreProductsQueryKey(slug, normalized),
    queryFn: ({ pageParam, signal }: { pageParam: number; signal?: AbortSignal }) =>
      getStoresSlugProducts(
        slug,
        { ...normalized, limit: STORE_PRODUCTS_PAGE_SIZE, offset: pageParam },
        undefined,
        signal
      ),
    initialPageParam: 0,
    getNextPageParam
  };
}
