// hooks/useStoreFilter.ts (updated)
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

type GridCols = 3 | 4;
export type SortBy = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating';

const sortValues = ['featured', 'newest', 'price-asc', 'price-desc', 'rating'] as const;

export function useStoreFilters(storeCategories: string[] = []) {
  const [params, setParams] = useQueryStates(
    {
      category: parseAsString.withDefault(''),
      sortBy: parseAsStringLiteral(sortValues).withDefault('featured'),
      priceMin: parseAsInteger.withDefault(0),
      priceMax: parseAsInteger.withDefault(500),
      searchQuery: parseAsString.withDefault(''),
      gridCols: parseAsInteger.withDefault(4),
      showOnlyNew: parseAsBoolean.withDefault(false),
      showOnlySale: parseAsBoolean.withDefault(false),
      minRating: parseAsInteger.withDefault(0),
      isDigital: parseAsBoolean.withDefault(false),
      page: parseAsInteger.withDefault(1)
    },
    { shallow: false }
  );

  const {
    category,
    sortBy,
    priceMin,
    priceMax,
    searchQuery,
    gridCols,
    showOnlyNew,
    showOnlySale,
    minRating,
    isDigital,
    page
  } = params;

  // Setters
  const setCategory = (value: string) => setParams({ category: value, page: 1 });
  const setSortBy = (value: SortBy) => setParams({ sortBy: value });

  const setPriceRange = useCallback(
    (values: [number, number]) => {
      setParams(
        { priceMin: values[0], priceMax: values[1], page: 1 },
        { limitUrlUpdates: debounce(300) }
      );
    },
    [setParams]
  );

  // Debounced search – updates URL only after 500ms of inactivity
  const setSearchQuery = useCallback(
    (value: string) => {
      setParams({ searchQuery: value, page: 1 }, { limitUrlUpdates: debounce(500) });
    },
    [setParams]
  );

  const setGridCols = (value: GridCols) => setParams({ gridCols: value });
  const setShowOnlyNew = (value: boolean) => setParams({ showOnlyNew: value, page: 1 });
  const setShowOnlySale = (value: boolean) => setParams({ showOnlySale: value, page: 1 });
  const setMinRating = (value: number) => setParams({ minRating: value, page: 1 });
  const setIsDigital = (value: boolean) => setParams({ isDigital: value, page: 1 });
  const setPage = (value: number) => setParams({ page: value });

  const clearFilters = () => {
    setParams({
      category: '',
      priceMin: 0,
      priceMax: 500,
      showOnlyNew: false,
      showOnlySale: false,
      searchQuery: '',
      sortBy: 'featured',
      minRating: 0,
      isDigital: false,
      page: 1
    });
  };

  const hasActiveFilters = useMemo(() => {
    return (
      category !== '' ||
      priceMin > 0 ||
      priceMax < 500 ||
      showOnlyNew ||
      showOnlySale ||
      searchQuery !== '' ||
      minRating > 0 ||
      isDigital
    );
  }, [category, priceMin, priceMax, showOnlyNew, showOnlySale, searchQuery, minRating, isDigital]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (category !== '') count++;
    if (priceMin > 0 || priceMax < 500) count++;
    if (showOnlyNew) count++;
    if (showOnlySale) count++;
    if (searchQuery !== '') count++;
    if (minRating > 0) count++;
    if (isDigital) count++;
    return count;
  }, [category, priceMin, priceMax, showOnlyNew, showOnlySale, searchQuery, minRating, isDigital]);

  return {
    // State
    category,
    sortBy,
    priceRange: [priceMin, priceMax] as [number, number],
    searchQuery,
    gridCols: gridCols as GridCols,
    showOnlyNew,
    showOnlySale,
    minRating,
    isDigital,
    page,
    // Setters
    setCategory,
    setSortBy,
    setPriceRange,
    setSearchQuery,
    setGridCols,
    setShowOnlyNew,
    setShowOnlySale,
    setMinRating,
    setIsDigital,
    setPage,
    clearFilters,
    // Helpers
    hasActiveFilters,
    activeFilterCount,
    storeCategories
  };
}
