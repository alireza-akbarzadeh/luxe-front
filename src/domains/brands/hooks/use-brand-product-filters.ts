'use client';

import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs';
import { useCallback, useMemo } from 'react';

import type { BrandProductSort } from '@/domains/brands/types/brands.types';
import type { GetProductsParams, GetProductsSort } from '@/services/-products-get.schemas';
import { GetProductsStatus } from '@/services/-products-get.schemas';

export const BRAND_PRODUCTS_PAGE_SIZE = 12;

const sortValues = ['popular', 'newest', 'price-asc', 'price-desc', 'rating'] as const;

function mapSortToApi(sort: BrandProductSort): GetProductsSort | undefined {
  switch (sort) {
    case 'newest':
      return 'newest';
    case 'price-asc':
      return 'price_asc';
    case 'price-desc':
      return 'price_desc';
    case 'rating':
      return 'rating_desc';
    case 'popular':
      return 'reviews_desc';
    default:
      return undefined;
  }
}

/** URL filters for products on a brand detail page. */
export function useBrandProductFilters(brandId: number) {
  const [params, setParams] = useQueryStates(
    {
      categoryId: parseAsInteger.withDefault(0),
      sortBy: parseAsStringLiteral(sortValues).withDefault('popular'),
      priceMin: parseAsInteger.withDefault(0),
      priceMax: parseAsInteger.withDefault(2000),
      page: parseAsInteger.withDefault(1),
      gender: parseAsString.withDefault('all')
    },
    { shallow: false }
  );

  const catalogParams = useMemo((): GetProductsParams => {
    return {
      brand_id: brandId,
      category_id: params.categoryId || undefined,
      limit: BRAND_PRODUCTS_PAGE_SIZE,
      offset: (params.page - 1) * BRAND_PRODUCTS_PAGE_SIZE,
      status: GetProductsStatus.active,
      sort: mapSortToApi(params.sortBy as BrandProductSort),
      min_price: params.priceMin > 0 ? params.priceMin : undefined,
      max_price: params.priceMax < 2000 ? params.priceMax : undefined
    };
  }, [brandId, params.categoryId, params.page, params.priceMax, params.priceMin, params.sortBy]);

  const clearFilters = useCallback(() => {
    void setParams({
      categoryId: 0,
      priceMin: 0,
      priceMax: 2000,
      page: 1,
      gender: 'all'
    });
  }, [setParams]);

  const hasActiveFilters =
    params.categoryId > 0 ||
    params.priceMin > 0 ||
    params.priceMax < 2000 ||
    params.gender !== 'all';

  return {
    categoryId: params.categoryId,
    sortBy: params.sortBy as BrandProductSort,
    priceMin: params.priceMin,
    priceMax: params.priceMax,
    page: params.page,
    gender: params.gender,
    setCategoryId: (categoryId: number) => void setParams({ categoryId, page: 1 }),
    setSortBy: (sortBy: BrandProductSort) => void setParams({ sortBy, page: 1 }),
    setPriceRange: (min: number, max: number) =>
      void setParams({ priceMin: min, priceMax: max, page: 1 }),
    setPage: (page: number) => void setParams({ page }),
    setGender: (gender: string) => void setParams({ gender, page: 1 }),
    clearFilters,
    hasActiveFilters,
    catalogParams
  };
}
