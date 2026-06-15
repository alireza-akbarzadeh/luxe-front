'use client';

import { useCallback, useMemo, useState } from 'react';

import {
  countSearchFilterDraft,
  createEmptySearchFilterDraft,
  createSearchFilterDraftFromParams,
  hasActiveSearchFilterDraft,
  type SearchFilterDraft
} from '../search.utils';
import type { SearchParams } from './useSearchParams';

/** Local filter draft for the mobile sheet — URL updates only on explicit apply. */
export function useSearchFilterDraft(searchParams: SearchParams) {
  const [draft, setDraft] = useState<SearchFilterDraft>(() =>
    createSearchFilterDraftFromParams(searchParams)
  );

  const syncFromUrl = useCallback(() => {
    setDraft(createSearchFilterDraftFromParams(searchParams));
  }, [searchParams]);

  const resetDraft = useCallback(() => {
    setDraft(createEmptySearchFilterDraft());
  }, []);

  const actions = useMemo(
    () => ({
      toggleCategory: (category: string) => {
        setDraft((current) => ({
          ...current,
          categories: current.categories.includes(category)
            ? current.categories.filter((item) => item !== category)
            : [...current.categories, category]
        }));
      },
      toggleStore: (storeId: string) => {
        setDraft((current) => ({
          ...current,
          stores: current.stores.includes(storeId)
            ? current.stores.filter((item) => item !== storeId)
            : [...current.stores, storeId]
        }));
      },
      setPriceRange: (priceRange: [number, number]) => {
        setDraft((current) => ({ ...current, priceRange }));
      },
      setMinRating: (minRating: number) => {
        setDraft((current) => ({ ...current, minRating }));
      },
      setInStock: (inStock: boolean) => {
        setDraft((current) => ({ ...current, inStock }));
      },
      setOnSale: (onSale: boolean) => {
        setDraft((current) => ({ ...current, onSale }));
      },
      setIsNew: (isNew: boolean) => {
        setDraft((current) => ({ ...current, isNew }));
      },
      setIsDigital: (isDigital: boolean) => {
        setDraft((current) => ({ ...current, isDigital }));
      }
    }),
    []
  );

  return {
    draft,
    actions,
    syncFromUrl,
    resetDraft,
    draftFilterCount: countSearchFilterDraft(draft),
    hasDraftFilters: hasActiveSearchFilterDraft(draft)
  };
}

export type SearchFilterDraftActions = ReturnType<typeof useSearchFilterDraft>['actions'];
