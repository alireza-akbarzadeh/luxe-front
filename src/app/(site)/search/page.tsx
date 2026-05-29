import { Suspense } from 'react';

import SearchDomain from '@/domains/search/search.domain';

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchDomain />
    </Suspense>
  );
}
