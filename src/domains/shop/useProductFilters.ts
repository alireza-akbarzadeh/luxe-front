'use client';

import {
  debounce,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates
} from 'nuqs';
import { useCallback, useMemo } from 'react';

import type { GetProductsParams, GetProductsSort } from '~/src/services/-products-get.schemas';

export const SHOP_PAGE_SIZE = 20;

type GridCols = 3 | 4;
type SortBy = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating';

const sortValues = ['featured', 'newest', 'price-asc', 'price-desc', 'rating'] as const;

const mapSortToApi = (sort: SortBy): GetProductsSort | undefined => {
  switch (sort) {
    case 'newest':
      return 'newest';
    case 'price-asc':
      return 'price_asc';
    case 'price-desc':
      return 'price_desc';
    case 'rating':
      return 'rating_desc';
    default:
      return undefined;
  }
};

export function useProductFilters() {
  const [params, setParams] = useQueryStates(
    {
      categoryId: parseAsInteger.withDefault(0),
      sortBy: parseAsStringLiteral(sortValues).withDefault('featured'),
      priceMin: parseAsInteger.withDefault(0),
      priceMax: parseAsInteger.withDefault(500),
      searchQuery: parseAsString.withDefault(''),
      gridCols: parseAsInteger.withDefault(4),
      showOnlyNew: parseAsBoolean.withDefault(false),
      showOnlySale: parseAsBoolean.withDefault(false),
      minRating: parseAsInteger.withDefault(0),
      maxRating: parseAsInteger.withDefault(5),
      minReviews: parseAsInteger.withDefault(0),
      maxReviews: parseAsInteger.withDefault(1000),
      isDigital: parseAsBoolean.withDefault(false),
      page: parseAsInteger.withDefault(1)
    },
    { shallow: false }
  );

  const {
    categoryId,
    sortBy,
    priceMin,
    priceMax,
    searchQuery,
    gridCols,
    showOnlyNew,
    showOnlySale,
    minRating,
    maxRating,
    minReviews,
    maxReviews,
    isDigital,
    page
  } = params;

  const setCategoryId = (id: number | null) => setParams({ categoryId: id, page: 1 });
  const setSortBy = (value: SortBy) => setParams({ sortBy: value, page: 1 });

  const setPriceRange = useCallback(
    (values: [number, number]) => {
      setParams(
        { priceMin: values[0], priceMax: values[1], page: 1 },
        { limitUrlUpdates: debounce(300) }
      );
    },
    [setParams]
  );

  const setSearchQuery = useCallback(
    (value: string) => {
      setParams({ searchQuery: value, page: 1 }, { limitUrlUpdates: debounce(500) });
    },
    [setParams]
  );

  const setGridCols = (value: GridCols) => setParams({ gridCols: value });
  const setShowOnlyNew = (value: boolean) => setParams({ showOnlyNew: value, page: 1 });
  const setShowOnlySale = (value: boolean) => setParams({ showOnlySale: value, page: 1 });
  const setRatingRange = (min: number, max: number) =>
    setParams({ minRating: min, maxRating: max, page: 1 });
  const setReviewsRange = (min: number, max: number) =>
    setParams({ minReviews: min, maxReviews: max, page: 1 });
  const setIsDigital = (value: boolean) => setParams({ isDigital: value, page: 1 });
  const setPage = (value: number) => setParams({ page: value });

  const clearFilters = () => {
    setParams({
      categoryId: null,
      priceMin: 0,
      priceMax: 500,
      showOnlyNew: false,
      showOnlySale: false,
      searchQuery: '',
      sortBy: 'featured',
      minRating: 0,
      maxRating: 5,
      minReviews: 0,
      maxReviews: 1000,
      isDigital: false,
      page: 1
    });
  };

  const apiParams: GetProductsParams = useMemo(
    () => ({
      limit: SHOP_PAGE_SIZE,
      offset: (page - 1) * SHOP_PAGE_SIZE,
      name: searchQuery || undefined,
      category_id: categoryId > 0 ? categoryId : undefined,
      min_price: priceMin > 0 ? priceMin : undefined,
      max_price: priceMax < 500 ? priceMax : undefined,
      is_new: showOnlyNew || undefined,
      sort: mapSortToApi(sortBy),
      min_rating: minRating > 0 ? minRating : undefined,
      max_rating: maxRating < 5 ? maxRating : undefined,
      min_reviews: minReviews > 0 ? minReviews : undefined,
      max_reviews: maxReviews < 1000 ? maxReviews : undefined,
      is_digital: isDigital || undefined
    }),
    [
      categoryId,
      isDigital,
      maxRating,
      maxReviews,
      minRating,
      minReviews,
      page,
      priceMax,
      priceMin,
      searchQuery,
      showOnlyNew,
      sortBy
    ]
  );

  const hasActiveFilters = useMemo(() => {
    return (
      categoryId > 0 ||
      priceMin > 0 ||
      priceMax < 500 ||
      showOnlyNew ||
      showOnlySale ||
      searchQuery !== '' ||
      minRating > 0 ||
      maxRating < 5 ||
      minReviews > 0 ||
      maxReviews < 1000 ||
      isDigital
    );
  }, [
    categoryId,
    priceMin,
    priceMax,
    showOnlyNew,
    showOnlySale,
    searchQuery,
    minRating,
    maxRating,
    minReviews,
    maxReviews,
    isDigital
  ]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (categoryId > 0) count++;
    if (priceMin > 0 || priceMax < 500) count++;
    if (showOnlyNew) count++;
    if (showOnlySale) count++;
    if (searchQuery) count++;
    if (minRating > 0 || maxRating < 5) count++;
    if (minReviews > 0 || maxReviews < 1000) count++;
    if (isDigital) count++;
    return count;
  }, [
    categoryId,
    priceMin,
    priceMax,
    showOnlyNew,
    showOnlySale,
    searchQuery,
    minRating,
    maxRating,
    minReviews,
    maxReviews,
    isDigital
  ]);

  return {
    categoryId,
    sortBy,
    priceRange: [priceMin, priceMax] as [number, number],
    searchQuery,
    gridCols,
    showOnlyNew,
    showOnlySale,
    minRating,
    maxRating,
    minReviews,
    maxReviews,
    isDigital,
    page,
    setCategoryId,
    setSortBy,
    setPriceRange,
    setSearchQuery,
    setGridCols,
    setShowOnlyNew,
    setShowOnlySale,
    setRatingRange,
    setReviewsRange,
    setIsDigital,
    setPage,
    clearFilters,
    apiParams,
    hasActiveFilters,
    activeFilterCount
  };
}
