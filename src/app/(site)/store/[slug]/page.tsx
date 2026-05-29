import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';

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
      <Suspense fallback={<div>Loading...</div>}>
        <StoreDomain slug={slug} />
      </Suspense>
    </HydrationBoundary>
  );
}
