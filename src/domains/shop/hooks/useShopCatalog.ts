'use client';

import { useMemo } from 'react';

import { useGetProducts } from '@/services/-products-get';
import type { DtoProductWithLike } from '@/services/-products-get.schemas';
import { useGetSearch } from '@/services/-search-get';

import {
  applyShopClientFilters,
  buildShopSearchParams,
  shouldUseSearchApi,
  toProductWithLike
} from '../lib/shop-search.utils';
import { useProductFilters } from '../useProductFilters';

function filterSaleProducts(products: DtoProductWithLike[]) {
  return products.filter(
    (product) => product.compare_at_price && product.compare_at_price > (product.price ?? 0)
  );
}

export function useShopCatalog() {
  const filters = useProductFilters();
  const {
    apiParams,
    searchQuery,
    showOnlySale,
    page,
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

  const searchApiParams = useMemo(
    () =>
      buildShopSearchParams({
        searchQuery: trimmedQuery,
        page,
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
      page,
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

  const productsQuery = useGetProducts(apiParams, {
    query: { enabled: !usesSearchApi }
  });

  const searchQueryResult = useGetSearch(searchApiParams, {
    query: { enabled: usesSearchApi }
  });

  const activeQuery = usesSearchApi ? searchQueryResult : productsQuery;

  const products = useMemo(() => {
    if (usesSearchApi) {
      return applyShopClientFilters(
        (searchQueryResult.data?.data?.products ?? []).map(toProductWithLike),
        clientFilterInput
      );
    }
    const list = productsQuery.data?.data?.products ?? [];
    return showOnlySale ? filterSaleProducts(list) : list;
  }, [
    usesSearchApi,
    searchQueryResult.data?.data?.products,
    productsQuery.data?.data?.products,
    showOnlySale,
    clientFilterInput
  ]);

  const total = usesSearchApi
    ? (searchQueryResult.data?.data?.total ?? 0)
    : (productsQuery.data?.data?.total ?? 0);

  const apiProducts = usesSearchApi
    ? (searchQueryResult.data?.data?.products ?? []).map(toProductWithLike)
    : (productsQuery.data?.data?.products ?? []);

  return {
    ...filters,
    products,
    total,
    apiProducts,
    usesSearchApi,
    isLoading: activeQuery.isLoading,
    isError: activeQuery.isError,
    refetch: activeQuery.refetch,
    isFetching: activeQuery.isFetching
  };
}
