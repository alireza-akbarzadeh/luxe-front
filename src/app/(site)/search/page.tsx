import { Suspense } from 'react';

import { SearchPageSkeleton } from '@/domains/search/components/search-page-skeleton';
import SearchDomain from '@/domains/search/search.domain';

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageSkeleton />}>
      <SearchDomain />
    </Suspense>
  );
}
