import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';

import { StoreSkeleton } from '@/domains/store/components/store-skeleton-loading';
import { StoreDomain } from '~/src/domains/store/containers/store.domain';
import { prefetchWithAuth } from '~/src/lib/prefetch-with-auth';
import { getGetStoresSlugQueryOptions } from '~/src/services/-stores-{slug}-get';

interface StorePageProps {
  params: Promise<{ slug: string }>;
}

export default async function StorePage(props: StorePageProps) {
  const { params } = props;
  const { slug } = await params;
  const queryClient = await prefetchWithAuth(getGetStoresSlugQueryOptions, slug);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<StoreSkeleton />}>
        <StoreDomain slug={slug} />
      </Suspense>
    </HydrationBoundary>
  );
}
