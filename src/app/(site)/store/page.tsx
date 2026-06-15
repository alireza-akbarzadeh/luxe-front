import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { cookies } from 'next/headers';
import { Suspense } from 'react';

import { StoresPageSkeleton } from '@/domains/store/components/stores-page-skeleton';
import { StoresDomain } from '@/domains/store/containers/stores.domain';
import {
  getInfiniteStoresQueryOptions,
  STORES_PAGE_SIZE
} from '@/domains/store/lib/infinite-stores-query';
import { getQueryClient } from '@/lib/query-client';
import { getStores } from '@/services/-stores-get';

export default async function StorePage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const queryClient = getQueryClient();
  const infiniteOptions = getInfiniteStoresQueryOptions({});

  try {
    await queryClient.prefetchInfiniteQuery({
      ...infiniteOptions,
      queryFn: ({ pageParam, signal }) =>
        getStores(
          { limit: STORES_PAGE_SIZE, offset: pageParam },
          { headers: { Cookie: cookieHeader } },
          signal
        )
    });
  } catch {
    // Client will fetch if SSR prefetch fails.
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<StoresPageSkeleton />}>
        <StoresDomain />
      </Suspense>
    </HydrationBoundary>
  );
}
