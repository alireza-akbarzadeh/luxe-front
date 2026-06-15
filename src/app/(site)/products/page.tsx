import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { cookies } from 'next/headers';
import { Suspense } from 'react';

import {
  getInfiniteProductsQueryOptions,
  PRODUCTS_PAGE_SIZE
} from '@/domains/products/lib/infinite-products-query';
import { ProductsDomain } from '@/domains/products/products.domain';
import { ShopProductsSkeleton } from '@/domains/shop/components/shop-products-skeleton';
import { getQueryClient } from '@/lib/query-client';
import { getProducts } from '@/services/-products-get';

export default async function ProductsPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const queryClient = getQueryClient();
  const infiniteOptions = getInfiniteProductsQueryOptions({});

  try {
    await queryClient.prefetchInfiniteQuery({
      ...infiniteOptions,
      queryFn: ({ pageParam, signal }) =>
        getProducts(
          { limit: PRODUCTS_PAGE_SIZE, offset: pageParam },
          { headers: { Cookie: cookieHeader } },
          signal
        )
    });
  } catch {
    // Client will fetch via the browser proxy if SSR prefetch fails.
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProductsPageFallback />}>
        <ProductsDomain />
      </Suspense>
    </HydrationBoundary>
  );
}

function ProductsPageFallback() {
  return (
    <div className='pb-20'>
      <div className='from-secondary/40 to-background border-b bg-linear-to-b pt-24 pb-12'>
        <div className='app-container space-y-4'>
          <div className='bg-muted h-8 w-32 animate-pulse rounded-full' />
          <div className='bg-muted h-12 w-72 max-w-full animate-pulse rounded-lg' />
          <div className='bg-muted h-4 max-w-xl animate-pulse rounded' />
        </div>
      </div>
      <div className='app-container mt-8'>
        <ShopProductsSkeleton />
      </div>
    </div>
  );
}
