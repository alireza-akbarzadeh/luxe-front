'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import {
  applyShopClientFilters,
  shouldUseSearchApi,
  toProductWithLike
} from '@/domains/shop/lib/shop-search.utils';
import { useProductFilters } from '@/domains/shop/useProductFilters';
import type { DtoProductWithLike } from '@/services/-products-get.schemas';

import { getInfiniteProductsQueryOptions } from '../lib/infinite-products-query';
import { getInfiniteSearchQueryOptions } from '../lib/infinite-search-query';
import {
  filterSaleProducts,
  flattenInfiniteProducts,
  getInfiniteProductsTotal,
  toProductsCatalogParams
} from '../lib/products.utils';

export { PRODUCTS_PAGE_SIZE } from '../lib/infinite-products-query';

export function useInfiniteProductCatalog() {
  const filters = useProductFilters();
  const {
    apiParams,
    searchQuery,
    showOnlySale,
    categoryId,
    brandId,
    priceRange,
    minRating,
    maxRating,
    minReviews,
    maxReviews,
    showOnlyNew,
    isDigital,
    inStock,
    sortBy
  } = filters;

  const [priceMin, priceMax] = priceRange;
  const trimmedQuery = searchQuery.trim();
  const usesSearchApi = shouldUseSearchApi(trimmedQuery, sortBy, { inStock });
  const catalogParams = useMemo(() => toProductsCatalogParams(apiParams), [apiParams]);

  const searchFilterInput = useMemo(
    () => ({
      searchQuery: trimmedQuery,
      categoryId,
      brandId,
      priceMin,
      priceMax,
      minRating,
      maxRating,
      minReviews,
      maxReviews,
      showOnlyNew,
      showOnlySale,
      isDigital,
      inStock,
      sortBy
    }),
    [
      trimmedQuery,
      categoryId,
      brandId,
      priceMin,
      priceMax,
      minRating,
      maxRating,
      minReviews,
      maxReviews,
      showOnlyNew,
      showOnlySale,
      isDigital,
      inStock,
      sortBy
    ]
  );

  const clientFilterInput = useMemo(
    () => ({ maxRating, minReviews, maxReviews, brandId }),
    [maxRating, minReviews, maxReviews, brandId]
  );

  const productsInfinite = useInfiniteQuery({
    ...getInfiniteProductsQueryOptions(catalogParams),
    enabled: !usesSearchApi,
    staleTime: 60_000,
    retry: 1
  });

  const searchInfinite = useInfiniteQuery({
    ...getInfiniteSearchQueryOptions(searchFilterInput),
    enabled: usesSearchApi,
    staleTime: 60_000,
    retry: 1
  });

  const activeQuery = usesSearchApi ? searchInfinite : productsInfinite;

  const rawProducts = useMemo((): DtoProductWithLike[] => {
    if (usesSearchApi) {
      const pages = searchInfinite.data?.pages ?? [];
      return applyShopClientFilters(
        pages.flatMap((page) => (page.data?.products ?? []).map(toProductWithLike)),
        clientFilterInput
      );
    }
    return flattenInfiniteProducts(productsInfinite.data?.pages ?? []);
  }, [usesSearchApi, searchInfinite.data?.pages, productsInfinite.data?.pages, clientFilterInput]);

  const products = useMemo(
    () => (usesSearchApi || !showOnlySale ? rawProducts : filterSaleProducts(rawProducts)),
    [rawProducts, showOnlySale, usesSearchApi]
  );

  const total = usesSearchApi
    ? (searchInfinite.data?.pages[0]?.data?.total ?? 0)
    : getInfiniteProductsTotal(productsInfinite.data?.pages);

  return {
    ...filters,
    products,
    total,
    loadedCount: rawProducts.length,
    usesSearchApi,
    isLoading: activeQuery.isLoading,
    isError: activeQuery.isError,
    refetch: activeQuery.refetch,
    isFetching: activeQuery.isFetching,
    isFetchingNextPage: activeQuery.isFetchingNextPage,
    hasNextPage: activeQuery.hasNextPage,
    fetchNextPage: activeQuery.fetchNextPage
  };
}
