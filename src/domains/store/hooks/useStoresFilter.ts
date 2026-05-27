'use client';
import { useQueryStates } from 'nuqs';
import { useCallback } from 'react';
import { storeFiltersParsers } from '~/src/domains/store/filter.schema';

export function useStoresFilters() {
  const [filters, setFilters] = useQueryStates(storeFiltersParsers, {
    history: 'replace',
    shallow: false
  });
  const reset = useCallback(() => {
    setFilters({
      search: '',
      category: [],
      rating: 0,
      verified: false,
      location: '',
      shippingSpeed: 'any',
      freeShipping: false,
      newOnly: false,
      followersMin: 0,
      storeSize: 'any',
      sort: 'popular',
      page: 1
    });
  }, [setFilters]);
  return { filters, setFilters, reset };
}
