'use client';

import { useEffect, useRef } from 'react';

import { useProductFilters } from '@/domains/shop/useProductFilters';

export function BestSellersSortPreset() {
  const { sortBy, setSortBy } = useProductFilters();
  const applied = useRef(false);

  useEffect(() => {
    if (applied.current) return;
    applied.current = true;
    if (sortBy !== 'popular' && sortBy !== 'best-selling') {
      setSortBy('popular');
    }
  }, [setSortBy, sortBy]);

  return null;
}
