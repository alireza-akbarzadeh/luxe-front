import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';

import { StoresDomain } from '@/domains/store/containers/stores.domain';
import { getQueryClient } from '@/lib/query-client';
import { getGetStoresQueryOptions } from '@/services/-stores-get';

export default async function StorePage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(getGetStoresQueryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading...</div>}>
        <StoresDomain />
      </Suspense>
    </HydrationBoundary>
  );
}
