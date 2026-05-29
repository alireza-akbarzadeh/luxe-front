'use client';

import {
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates} from 'nuqs';
import { useMemo } from 'react';

import type { GetProductsParams, GetProductsSort } from '~/src/services/-products-get.schemas';

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
      // Existing filters
      categoryId: parseAsInteger.withDefault(0),
      sortBy: parseAsStringLiteral(sortValues).withDefault('featured'),
      priceMin: parseAsInteger.withDefault(0),
      priceMax: parseAsInteger.withDefault(500),
      searchQuery: parseAsString.withDefault(''),
      gridCols: parseAsInteger.withDefault(4),
      showOnlyNew: parseAsBoolean.withDefault(false),
      showOnlySale: parseAsBoolean.withDefault(false), // client-only, not in API

      // New API-supported filters
      minRating: parseAsInteger.withDefault(0),
      maxRating: parseAsInteger.withDefault(5),
      minReviews: parseAsInteger.withDefault(0),
      maxReviews: parseAsInteger.withDefault(1000), // adjust default as needed
      isDigital: parseAsBoolean.withDefault(false)
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
    isDigital
  } = params;

  // ── Setters ──────────────────────────────────────────
  const setCategoryId = (id: number | null) => setParams({ categoryId: id });
  const setSortBy = (value: SortBy) => setParams({ sortBy: value });
  const setPriceRange = (values: [number, number]) =>
    setParams({ priceMin: values[0], priceMax: values[1] });
  const setSearchQuery = (value: string) => setParams({ searchQuery: value });
  const setGridCols = (value: GridCols) => setParams({ gridCols: value });
  const setShowOnlyNew = (value: boolean) => setParams({ showOnlyNew: value });
  const setShowOnlySale = (value: boolean) => setParams({ showOnlySale: value });

  // New setters
  const setRatingRange = (min: number, max: number) =>
    setParams({ minRating: min, maxRating: max });
  const setReviewsRange = (min: number, max: number) =>
    setParams({ minReviews: min, maxReviews: max });
  const setIsDigital = (value: boolean) => setParams({ isDigital: value });

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
      isDigital: false
    });
  };

  // ── Convert to API parameters ─────────────────────────
  const apiParams: GetProductsParams = {
    limit: 20,
    offset: 0,
    name: searchQuery || undefined,
    min_price: priceMin > 0 ? priceMin : undefined,
    max_price: priceMax < 500 ? priceMax : undefined,
    is_new: showOnlyNew || undefined,
    sort: mapSortToApi(sortBy),
    min_rating: minRating > 0 ? minRating : undefined,
    max_rating: maxRating < 5 ? maxRating : undefined,
    min_reviews: minReviews > 0 ? minReviews : undefined,
    max_reviews: maxReviews < 1000 ? maxReviews : undefined,
    is_digital: isDigital || undefined
  };

  const hasActiveFilters = useMemo(() => {
    return (
      categoryId !== null ||
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

  return {
    // State
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
    // Setters
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
    clearFilters,
    // Helpers
    apiParams,
    hasActiveFilters
  };
}
