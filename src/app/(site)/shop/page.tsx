import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { cookies } from 'next/headers';
import { Suspense } from 'react';

import { ShopProductsSkeleton } from '@/domains/shop/components/shop-products-skeleton';
import { ShopDomain } from '@/domains/shop/shop.domain';
import { getQueryClient } from '@/lib/query-client';
import { getGetProductsQueryOptions } from '@/services/-products-get';

export default async function ShopPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const queryClient = getQueryClient();

  const options = {
    request: {
      headers: { Cookie: cookieHeader }
    }
  };

  await queryClient.prefetchQuery(getGetProductsQueryOptions({ limit: 20, offset: 0 }, options));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ShopPageFallback />}>
        <ShopDomain />
      </Suspense>
    </HydrationBoundary>
  );
}

function ShopPageFallback() {
  return (
    <div className='app-container mt-10 pb-16'>
      <div className='mb-12 space-y-4'>
        <div className='bg-muted h-10 w-48 animate-pulse rounded-lg' />
        <div className='bg-muted h-4 max-w-2xl animate-pulse rounded' />
      </div>
      <ShopProductsSkeleton />
    </div>
  );
}
