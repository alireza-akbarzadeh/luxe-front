import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Suspense } from 'react';

import { ProductsPageSkeleton } from '@/domains/products/components/products-page-skeleton';
import {
  getInfiniteProductsQueryOptions,
  PRODUCTS_PAGE_SIZE
} from '@/domains/products/lib/infinite-products-query';
import { ProductsDomain } from '@/domains/products/products.domain';
import { getQueryClient } from '@/lib/query-client';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { getProducts } from '@/services/-products-get';

export const metadata: Metadata = buildPageMetadata({
  title: 'All Products',
  description:
    'Explore every product in the Luxe marketplace — new arrivals, bestsellers, and editor picks.',
  path: '/products'
});

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
      <Suspense fallback={<ProductsPageSkeleton />}>
        <ProductsDomain />
      </Suspense>
    </HydrationBoundary>
  );
}
