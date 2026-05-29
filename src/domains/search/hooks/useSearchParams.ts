'use client';

import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates} from 'nuqs';
import { useMemo } from 'react';

type SortBy = 'relevance' | 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'popular';
type ViewMode = 'grid' | 'list';

const sortValues = ['relevance', 'newest', 'price-asc', 'price-desc', 'rating', 'popular'] as const;

const viewModeValues = ['grid', 'list'] as const;

export function useSearchParams() {
  const [params, setParams] = useQueryStates(
    {
      q: parseAsString.withDefault(''),
      categories: parseAsArrayOf(parseAsString).withDefault([]),
      stores: parseAsArrayOf(parseAsString).withDefault([]),
      sortBy: parseAsStringLiteral(sortValues).withDefault('relevance'),
      priceMin: parseAsInteger.withDefault(0),
      priceMax: parseAsInteger.withDefault(1000),
      minRating: parseAsInteger.withDefault(0),
      inStock: parseAsBoolean.withDefault(false),
      onSale: parseAsBoolean.withDefault(false),
      isNew: parseAsBoolean.withDefault(false),
      isDigital: parseAsBoolean.withDefault(false),
      view: parseAsStringLiteral(viewModeValues).withDefault('grid'),
      page: parseAsInteger.withDefault(1),
      perPage: parseAsInteger.withDefault(12)
    },
    { shallow: false }
  );

  const {
    q,
    categories,
    stores,
    sortBy,
    priceMin,
    priceMax,
    minRating,
    inStock,
    onSale,
    isNew,
    isDigital,
    view,
    page,
    perPage
  } = params;

  // Setters
  const setQuery = (value: string) => setParams({ q: value, page: 1 });
  const setCategories = (value: string[]) => setParams({ categories: value, page: 1 });
  const toggleCategory = (category: string) => {
    const newCategories = categories.includes(category)
      ? categories.filter((c) => c !== category)
      : [...categories, category];
    setParams({ categories: newCategories, page: 1 });
  };
  const setStores = (value: string[]) => setParams({ stores: value, page: 1 });
  const toggleStore = (store: string) => {
    const newStores = stores.includes(store)
      ? stores.filter((s) => s !== store)
      : [...stores, store];
    setParams({ stores: newStores, page: 1 });
  };
  const setSortBy = (value: SortBy) => setParams({ sortBy: value });
  const setPriceRange = (values: [number, number]) =>
    setParams({ priceMin: values[0], priceMax: values[1], page: 1 });
  const setMinRating = (value: number) => setParams({ minRating: value, page: 1 });
  const setInStock = (value: boolean) => setParams({ inStock: value, page: 1 });
  const setOnSale = (value: boolean) => setParams({ onSale: value, page: 1 });
  const setIsNew = (value: boolean) => setParams({ isNew: value, page: 1 });
  const setIsDigital = (value: boolean) => setParams({ isDigital: value, page: 1 });
  const setView = (value: ViewMode) => setParams({ view: value });
  const setPage = (value: number) => setParams({ page: value });
  const setPerPage = (value: number) => setParams({ perPage: value, page: 1 });

  const clearFilters = () => {
    setParams({
      categories: [],
      stores: [],
      priceMin: 0,
      priceMax: 1000,
      minRating: 0,
      inStock: false,
      onSale: false,
      isNew: false,
      isDigital: false,
      sortBy: 'relevance',
      page: 1
    });
  };

  const clearAll = () => {
    setParams({
      q: '',
      categories: [],
      stores: [],
      priceMin: 0,
      priceMax: 1000,
      minRating: 0,
      inStock: false,
      onSale: false,
      isNew: false,
      isDigital: false,
      sortBy: 'relevance',
      page: 1
    });
  };

  const hasActiveFilters = useMemo(() => {
    return (
      categories.length > 0 ||
      stores.length > 0 ||
      priceMin > 0 ||
      priceMax < 1000 ||
      minRating > 0 ||
      inStock ||
      onSale ||
      isNew ||
      isDigital
    );
  }, [categories, stores, priceMin, priceMax, minRating, inStock, onSale, isNew, isDigital]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (categories.length > 0) count += categories.length;
    if (stores.length > 0) count += stores.length;
    if (priceMin > 0 || priceMax < 1000) count++;
    if (minRating > 0) count++;
    if (inStock) count++;
    if (onSale) count++;
    if (isNew) count++;
    if (isDigital) count++;
    return count;
  }, [categories, stores, priceMin, priceMax, minRating, inStock, onSale, isNew, isDigital]);

  return {
    // State
    query: q,
    categories,
    stores,
    sortBy,
    priceRange: [priceMin, priceMax] as [number, number],
    minRating,
    inStock,
    onSale,
    isNew,
    isDigital,
    view,
    page,
    perPage,
    // Setters
    setQuery,
    setCategories,
    toggleCategory,
    setStores,
    toggleStore,
    setSortBy,
    setPriceRange,
    setMinRating,
    setInStock,
    setOnSale,
    setIsNew,
    setIsDigital,
    setView,
    setPage,
    setPerPage,
    clearFilters,
    clearAll,
    // Helpers
    hasActiveFilters,
    activeFilterCount
  };
}

export type SearchParams = ReturnType<typeof useSearchParams>;
