// app/page.tsx
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { HomeDomains } from '@/domains/home/home.domain';
import { getQueryClient } from '~/src/lib/query-client';
import { getGetCategoriesQueryOptions } from '~/src/services/-categories-get';
import { getGetProductsQueryOptions } from '~/src/services/-products-get';
import type { GetProductsParams } from '~/src/services/-products-get.schemas';

export default async function HomePage() {
  const queryClient = getQueryClient();

  const featuredParams: GetProductsParams = {
    status: 'active',
    limit: 8,
    offset: 0,
    sort: 'rating_desc'
  };

  await Promise.all([
    queryClient.prefetchQuery(getGetProductsQueryOptions(featuredParams)),
    queryClient.prefetchQuery(
      getGetCategoriesQueryOptions({ is_active: true, limit: 8, offset: 0 })
    ),
    queryClient.prefetchQuery(
      getGetProductsQueryOptions({
        status: 'active',
        limit: 6,
        offset: 0,
        is_new: true,
        sort: 'newest'
      })
    ),
    queryClient.prefetchQuery(
      getGetProductsQueryOptions({
        status: 'active',
        limit: 3,
        offset: 0,
        sort: 'newest'
      })
    )
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeDomains />
    </HydrationBoundary>
  );
}
