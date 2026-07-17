'use client';

import { parseAsInteger, parseAsStringLiteral, useQueryStates } from 'nuqs';
import { useMemo } from 'react';

import type { GetCollectionsSlugSlugProductsParams } from '@/services/-collections-slug-{slug}-products-get.schemas';

export const COLLECTION_PRODUCTS_PAGE_SIZE = 12;

const sortValues = ['newest', 'price-asc', 'price-desc', 'rating', 'popular'] as const;

type CollectionSort = (typeof sortValues)[number];

function mapSortToApi(sort: CollectionSort) {
  switch (sort) {
    case 'price-asc':
      return 'price_asc';
    case 'price-desc':
      return 'price_desc';
    case 'rating':
      return 'rating_desc';
    case 'popular':
      return 'reviews_desc';
    default:
      return 'newest';
  }
}

/** URL filters for collection detail product results. */
export function useCollectionProductFilters() {
  const [params, setParams] = useQueryStates(
    {
      categoryId: parseAsInteger.withDefault(0),
      sortBy: parseAsStringLiteral(sortValues).withDefault('newest'),
      priceMin: parseAsInteger.withDefault(0),
      priceMax: parseAsInteger.withDefault(0),
      page: parseAsInteger.withDefault(1)
    },
    { shallow: false }
  );

  const apiParams = useMemo((): GetCollectionsSlugSlugProductsParams => {
    return {
      category_id: params.categoryId || undefined,
      sort: mapSortToApi(params.sortBy),
      min_price: params.priceMin > 0 ? params.priceMin : undefined,
      max_price: params.priceMax > 0 ? params.priceMax : undefined,
      limit: COLLECTION_PRODUCTS_PAGE_SIZE,
      offset: (params.page - 1) * COLLECTION_PRODUCTS_PAGE_SIZE
    };
  }, [params.categoryId, params.page, params.priceMax, params.priceMin, params.sortBy]);

  return {
    categoryId: params.categoryId,
    sortBy: params.sortBy,
    priceMin: params.priceMin,
    priceMax: params.priceMax,
    page: params.page,
    setCategoryId: (categoryId: number) => void setParams({ categoryId, page: 1 }),
    setSortBy: (sortBy: CollectionSort) => void setParams({ sortBy, page: 1 }),
    setPriceRange: (min: number, max: number) =>
      void setParams({ priceMin: min, priceMax: max, page: 1 }),
    setPage: (page: number) => void setParams({ page }),
    clearFilters: () => void setParams({ categoryId: 0, priceMin: 0, priceMax: 0, page: 1 }),
    hasActiveFilters: params.categoryId > 0 || params.priceMin > 0 || params.priceMax > 0,
    apiParams
  };
}
