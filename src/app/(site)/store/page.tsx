import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Suspense } from 'react';

import { StoresPageSkeleton } from '@/domains/store/components/stores-page-skeleton';
import { StoresDomain } from '@/domains/store/containers/stores.domain';
import {
  getInfiniteStoresQueryOptions,
  STORES_PAGE_SIZE
} from '@/domains/store/lib/infinite-stores-query';
import { getQueryClient } from '@/lib/query-client';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { getStores } from '@/services/-stores-get';

export const metadata: Metadata = buildPageMetadata({
  title: 'Stores',
  description:
    'Discover verified Luxe sellers — boutique brands, specialty stores, and marketplace favorites.',
  path: '/store'
});

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
