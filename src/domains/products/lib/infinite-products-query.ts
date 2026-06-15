import { getGetProductsQueryKey, getProducts } from '@/services/-products-get';

import { normalizeProductsCatalogParams, type ProductsCatalogParams } from './products.utils';

export const PRODUCTS_PAGE_SIZE = 24;

/** Stable query key for infinite product catalog fetches. */
export function getInfiniteProductsQueryKey(baseParams: ProductsCatalogParams = {}) {
  const normalized = normalizeProductsCatalogParams(baseParams);

  return [
    ...getGetProductsQueryKey({ ...normalized, limit: PRODUCTS_PAGE_SIZE, offset: 0 }),
    'infinite'
  ] as const;
}

function getNextPageParam(
  lastPage: Awaited<ReturnType<typeof getProducts>>,
  allPages: Awaited<ReturnType<typeof getProducts>>[]
) {
  const loaded = allPages.reduce((sum, page) => sum + (page.data?.products?.length ?? 0), 0);
  const total = lastPage.data?.total ?? 0;
  return loaded < total ? loaded : undefined;
}

/** Shared infinite-query options for client hooks and SSR prefetch. */
export function getInfiniteProductsQueryOptions(baseParams: ProductsCatalogParams = {}) {
  const normalized = normalizeProductsCatalogParams(baseParams);

  return {
    queryKey: getInfiniteProductsQueryKey(normalized),
    queryFn: ({ pageParam, signal }: { pageParam: number; signal?: AbortSignal }) =>
      getProducts(
        { ...normalized, limit: PRODUCTS_PAGE_SIZE, offset: pageParam },
        undefined,
        signal
      ),
    initialPageParam: 0,
    getNextPageParam
  };
}
