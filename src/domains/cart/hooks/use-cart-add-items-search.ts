'use client';

import { keepPreviousData } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import { useDebounce } from '@/hooks/useDebounce';
import { useGetSearch } from '@/services/-search-get';
import type { DtoProductResponse } from '@/services/-search-get.schemas';
import { useGetSearchSuggestions } from '@/services/-search-suggestions-get';
import type { DtoSuggestionItem } from '@/services/-search-suggestions-get.schemas';
import { useGetSearchTrending } from '@/services/-search-trending-get';

/** Debounced product search for the cart "Add items" drawer — no route navigation. */
export function useCartAddItemsSearch() {
  const [inputValue, setInputValue] = useState('');
  const debouncedQuery = useDebounce(inputValue.trim(), 300);
  const hasQuery = debouncedQuery.length > 0;

  const { data: searchData, isLoading: searchLoading } = useGetSearch(
    { q: debouncedQuery, limit: 20, in_stock: true, sort: 'popular' },
    {
      query: {
        enabled: debouncedQuery.length >= 2,
        placeholderData: keepPreviousData
      }
    }
  );

  const { data: suggestionsData, isLoading: suggestionsLoading } = useGetSearchSuggestions(
    { q: debouncedQuery, limit: 12 },
    {
      query: {
        enabled: hasQuery && debouncedQuery.length < 2
      }
    }
  );

  const { data: trendingData } = useGetSearchTrending({ limit: 8 });

  const suggestionProducts = useMemo(
    () =>
      (suggestionsData?.data?.suggestions ?? []).filter(
        (item): item is DtoSuggestionItem & { id: number; type: 'product' } =>
          item.type === 'product' && typeof item.id === 'number'
      ),
    [suggestionsData?.data?.suggestions]
  );

  const searchProducts = useMemo(
    () => searchData?.data?.products ?? [],
    [searchData?.data?.products]
  );

  const products: DtoProductResponse[] = useMemo(() => {
    if (debouncedQuery.length >= 2) {
      return searchProducts;
    }

    if (!hasQuery) {
      return [];
    }

    return suggestionProducts.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      images: item.image ? [item.image] : undefined,
      slug: item.slug,
      stock: 99
    }));
  }, [debouncedQuery.length, hasQuery, searchProducts, suggestionProducts]);

  const trendingSearches =
    trendingData?.data?.trending
      ?.map((entry) => entry.query)
      .filter((query): query is string => Boolean(query)) ?? [];

  const isLoading =
    debouncedQuery.length >= 2 ? searchLoading : hasQuery ? suggestionsLoading : false;

  return {
    inputValue,
    setInputValue,
    debouncedQuery,
    products,
    trendingSearches,
    isLoading,
    hasQuery
  };
}
