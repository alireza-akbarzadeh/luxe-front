import {
  buildShopSearchParams,
  type ShopSearchFilterInput
} from '@/domains/shop/lib/shop-search.utils';
import { getGetSearchQueryKey, getSearch } from '@/services/-search-get';

import { PRODUCTS_PAGE_SIZE } from './infinite-products-query';

function getSearchCatalogKey(input: Omit<ShopSearchFilterInput, 'page'>) {
  return buildShopSearchParams({
    ...input,
    page: 1,
    limit: PRODUCTS_PAGE_SIZE
  });
}

/** Stable query key for infinite search catalog fetches. */
export function getInfiniteSearchQueryKey(input: Omit<ShopSearchFilterInput, 'page'>) {
  return [...getGetSearchQueryKey(getSearchCatalogKey(input)), 'infinite'] as const;
}

function getNextSearchPageParam(
  lastPage: Awaited<ReturnType<typeof getSearch>>,
  allPages: Awaited<ReturnType<typeof getSearch>>[]
) {
  const loaded = allPages.reduce((sum, page) => sum + (page.data?.products?.length ?? 0), 0);
  const total = lastPage.data?.total ?? 0;
  return loaded < total ? loaded : undefined;
}

/** Infinite-query options for GET /search when the shop filter bar has a text query. */
export function getInfiniteSearchQueryOptions(input: Omit<ShopSearchFilterInput, 'page'>) {
  return {
    queryKey: getInfiniteSearchQueryKey(input),
    queryFn: ({ pageParam, signal }: { pageParam: number; signal?: AbortSignal }) => {
      const baseParams = getSearchCatalogKey(input);
      return getSearch(
        { ...baseParams, limit: PRODUCTS_PAGE_SIZE, offset: pageParam },
        undefined,
        signal
      );
    },
    initialPageParam: 0,
    getNextPageParam: getNextSearchPageParam
  };
}
