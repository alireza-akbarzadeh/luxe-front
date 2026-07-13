'use client';

import type { ReactNode } from 'react';

import { SearchResultsSkeleton } from '@/domains/search/components/search-results-skeleton';
import { useSearchParams } from '@/domains/search/hooks/useSearchParams';

type SearchResultsPendingProps = {
  isPending: boolean;
  skeletonCount: number;
  children: ReactNode;
};

/** While search refetches, swap in a view-matched skeleton (no status pill). */
export function SearchResultsPending({
  isPending,
  skeletonCount,
  children
}: SearchResultsPendingProps) {
  const { view } = useSearchParams();

  if (isPending) {
    return <SearchResultsSkeleton count={skeletonCount} view={view} />;
  }

  return children;
}
