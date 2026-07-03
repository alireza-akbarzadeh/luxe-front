'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { getProductPath } from '@/domains/product/lib/product-routes';
import { useDebounce } from '@/hooks/useDebounce';
import { useGetCategories } from '@/services/-categories-get';
import { useGetSearchSuggestions } from '@/services/-search-suggestions-get';
import type { DtoSuggestionItem } from '@/services/-search-suggestions-get.schemas';
import { useGetSearchTrending } from '@/services/-search-trending-get';

import { parseSearchIntent } from '../hooks/use-search-intent';
import { useSearchParams } from '../hooks/useSearchParams';
import { isNaturalLanguageSearchQuery } from '../lib/is-natural-language-search';
import { useSearchStore } from '../search.store';
import { buildIntentSearchUrl } from '../search.utils';

interface UseSearchHeroControllerOptions {
  autoFocus?: boolean;
  closeOnNavigate?: boolean;
}

export function useSearchHeroController(options: UseSearchHeroControllerOptions = {}) {
  const { autoFocus = false, closeOnNavigate = false } = options;

  const [showSuggestions, setShowSuggestions] = useState(autoFocus);
  const [isSearching, setIsSearching] = useState(false);
  const [focusedSuggestion, setFocusedSuggestion] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const searchStore = useSearchStore();
  const openSearchSheet = useSearchStore((state) => state.openSearchSheet);
  const closeSearchSheet = useSearchStore((state) => state.closeSearchSheet);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const urlQuery = searchParams.query;

  const [inputValue, setInputValue] = useState(urlQuery);
  const [syncedQuery, setSyncedQuery] = useState(urlQuery);

  if (urlQuery !== syncedQuery) {
    setSyncedQuery(urlQuery);
    setInputValue(urlQuery);
  }

  const debouncedInputValue = useDebounce(inputValue, 300);

  useEffect(() => {
    if (!autoFocus) return;
    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [autoFocus]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (window.matchMedia('(max-width: 1023px)').matches) {
          openSearchSheet();
          return;
        }
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [openSearchSheet]);

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

  const { data: trendingData } = useGetSearchTrending({ limit: 6 });
  const trendingSearches =
    trendingData?.data?.trending
      ?.map((t) => t.query)
      .filter((query): query is string => Boolean(query)) || [];

  const { data: categoriesData } = useGetCategories({ limit: 6, sort: 'popular' });
  const popularCategories = categoriesData?.data?.categories?.map((c) => c.name) || [];

  const navigateToSearch = useCallback(
    (query: string) => {
      const trimmed = query.trim();
      if (!trimmed) return;

      if (pathname === '/search') {
        searchParams.setQuery(trimmed);
      } else {
        router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      }

      if (closeOnNavigate) {
        closeSearchSheet();
      }
    },
    [closeOnNavigate, closeSearchSheet, pathname, router, searchParams]
  );

  const handleSearch = useCallback(
    async (query: string) => {
      const trimmed = query.trim();
      if (!trimmed) return;

      setShowSuggestions(false);
      setIsSearching(true);

      try {
        if (isNaturalLanguageSearchQuery(trimmed)) {
          const intent = await parseSearchIntent(trimmed);
          if (intent?.is_intent_query && intent.search_query) {
            searchStore.clearIntentContext();

            if (pathname === '/search') {
              searchParams.applyIntentSearch(intent, trimmed);
            } else {
              router.push(buildIntentSearchUrl(intent, trimmed));
            }

            if (intent.interpretation) {
              searchStore.setIntentContext(trimmed, intent.interpretation);
            }

            searchStore.addRecentSearch(trimmed, 0);
            searchStore.incrementSearchCount();
            if (closeOnNavigate) {
              closeSearchSheet();
            }
            return;
          }
        }

        searchStore.clearIntentContext();
        navigateToSearch(trimmed);
        searchStore.addRecentSearch(trimmed, 0);
        searchStore.incrementSearchCount();
      } finally {
        setTimeout(() => setIsSearching(false), 300);
      }
    },
    [
      closeOnNavigate,
      closeSearchSheet,
      navigateToSearch,
      pathname,
      router,
      searchParams,
      searchStore
    ]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (focusedSuggestion >= 0 && suggestions[focusedSuggestion]) {
        handleSuggestionClick(suggestions[focusedSuggestion]);
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
      if (closeOnNavigate) {
        closeSearchSheet();
      } else {
        inputRef.current?.blur();
      }
    }
  };

  const handleSuggestionClick = (suggestion: DtoSuggestionItem) => {
    if (suggestion.type === 'product') {
      if (closeOnNavigate) closeSearchSheet();
      window.open(getProductPath({ slug: suggestion.slug, id: suggestion.id }), '_blank');
      return;
    }

    if (suggestion.type === 'store') {
      if (closeOnNavigate) closeSearchSheet();
      window.open(`/store/${suggestion.slug}`, '_blank');
      return;
    }

    if (suggestion.type === 'category') {
      if (pathname !== '/search') {
        router.push(`/search?categories=${encodeURIComponent(suggestion.name ?? '')}`);
      } else {
        searchParams.toggleCategory(suggestion.name ?? '');
      }
      setShowSuggestions(false);
      if (closeOnNavigate) closeSearchSheet();
      return;
    }

    handleSearch(suggestion.name ?? '');
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
