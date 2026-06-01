'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useDebounce } from '@/hooks/useDebounce';
import { useGetCategories } from '@/services/-categories-get'; // assuming you have this endpoint
import { useGetSearchSuggestions } from '@/services/-search-suggestions-get';
import type { DtoSuggestionItem } from '@/services/-search-suggestions-get.schemas';
import { useGetSearchTrending } from '@/services/-search-trending-get';

import { useSearchParams } from '../hooks/useSearchParams';
import { useSearchStore } from '../search.store';

export function useSearchHeroController() {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [focusedSuggestion, setFocusedSuggestion] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const searchStore = useSearchStore();
  const searchParams = useSearchParams();

  const [inputValue, setInputValue] = useState(searchParams.query);
  const debouncedInputValue = useDebounce(inputValue, 300);

  // Global keyboard shortcut
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Fetch suggestions (only when input has value)
  const { data: suggestionsData, isLoading: suggestionsLoading } = useGetSearchSuggestions(
    {
      q: debouncedInputValue,
      limit: 8
    },
    {
      query: {
        enabled: inputValue.trim().length > 0 && showSuggestions
      }
    }
  );
  const suggestions = suggestionsData?.data?.suggestions || [];

  // Fetch trending searches
  const { data: trendingData } = useGetSearchTrending({ limit: 6 });
  const trendingSearches = trendingData?.data?.trending?.map((t) => t.query) || [];

  // Fetch popular categories (limit 6)
  const { data: categoriesData } = useGetCategories({ limit: 6, sort: 'popular' });
  const popularCategories = categoriesData?.data?.categories?.map((c) => c.name) || [];

  const handleSearch = useCallback(
    (query: string) => {
      setShowSuggestions(false);
      setIsSearching(true);
      searchParams.setQuery(query);
      // Result count is not known immediately; we can pass 0 or fetch later
      searchStore.addRecentSearch(query, 0);
      searchStore.incrementSearchCount();
      setTimeout(() => setIsSearching(false), 300);
    },
    [searchParams, searchStore]
  );

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (focusedSuggestion >= 0 && suggestions[focusedSuggestion]) {
        const suggestion = suggestions[focusedSuggestion];
        if (suggestion.type === 'product') {
          window.open(`/product/${suggestion.id}`, '_blank');
        } else if (suggestion.type === 'store') {
          window.open(`/store/${suggestion.slug}`, '_blank');
        } else if (suggestion.type === 'category') {
          searchParams.toggleCategory(suggestion.name ?? '');
          setShowSuggestions(false);
        } else {
          handleSearch(suggestion.name ?? '');
        }
      } else {
        handleSearch(inputValue);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedSuggestion((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedSuggestion((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestion: DtoSuggestionItem) => {
    if (suggestion.type === 'product') {
      window.open(`/product/${suggestion.id}`, '_blank');
    } else if (suggestion.type === 'store') {
      window.open(`/store/${suggestion.slug}`, '_blank');
    } else if (suggestion.type === 'category') {
      searchParams.toggleCategory(suggestion.name ?? '');
      setShowSuggestions(false);
    } else {
      handleSearch(suggestion.name ?? '');
    }
  };

  return {
    handleSearch,
    handleKeyDown,
    handleSuggestionClick,
    popularCategories,
    trendingSearches,
    isSearching,
    suggestionsLoading,
    setInputValue,
    suggestionsRef,
    inputRef,
    inputValue,
    setShowSuggestions,
    setFocusedSuggestion,
    showSuggestions,
    searchStore,
    suggestions,
    focusedSuggestion
  };
}
