import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { getGetStoresQueryOptions } from '@/services/-stores-get';
import { StoresDomain } from '@/domains/store/stores.domain';

export default async function StorePage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(getGetStoresQueryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StoresDomain />
    </HydrationBoundary>
  );
}
