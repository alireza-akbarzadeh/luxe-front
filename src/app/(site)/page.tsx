// app/page.tsx
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { Metadata } from 'next';

import { SiteJsonLd } from '@/components/seo/site-json-ld';
import { HomeDomains } from '@/domains/home/home.domain';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { getGetHomeCategoriesQueryOptions } from '@/services/-home-categories-get';
import { getGetHomeFlashDealsQueryOptions } from '@/services/-home-flash-deals-get';
import { getGetHomeNewArrivalsQueryOptions } from '@/services/-home-new-arrivals-get';
import { getGetHomePopularCollectionsQueryOptions } from '@/services/-home-popular-collections-get';
import { getGetHomeTopBrandsQueryOptions } from '@/services/-home-top-brands-get';
import { getGetHomeTopProductsQueryOptions } from '@/services/-home-top-products-get';
import { getGetHomeTrendingProductsQueryOptions } from '@/services/-home-trending-products-get';
import { getQueryClient } from '~/src/lib/query-client';

export const metadata: Metadata = buildPageMetadata({
  title: 'Premium Fashion & Lifestyle',
  description:
    'Shop curated luxury fashion, accessories, and lifestyle products at Luxe. Premium brands, fast shipping, easy returns, and exceptional service.',
  path: '/',
  keywords:
    'luxe, luxury fashion, premium ecommerce, designer clothing, luxury accessories, lifestyle products'
});

export default async function HomePage() {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery(getGetHomeCategoriesQueryOptions({ limit: 8 })),
    queryClient.prefetchQuery(getGetHomeTopProductsQueryOptions({ limit: 8 })),
    queryClient.prefetchQuery(getGetHomeNewArrivalsQueryOptions({ limit: 8 })),
    queryClient.prefetchQuery(getGetHomeTrendingProductsQueryOptions({ limit: 8 })),
    queryClient.prefetchQuery(getGetHomeNewArrivalsQueryOptions({ limit: 3 })),
    queryClient.prefetchQuery(getGetHomeNewArrivalsQueryOptions({ limit: 5 })),
    queryClient.prefetchQuery(getGetHomeTopBrandsQueryOptions({ limit: 12 })),
    queryClient.prefetchQuery(getGetHomePopularCollectionsQueryOptions({ limit: 2 })),
    queryClient.prefetchQuery(getGetHomeFlashDealsQueryOptions({ limit: 1 }))
  ]);

  return (
    <>
      <SiteJsonLd />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <HomeDomains />
      </HydrationBoundary>
    </>
  );
}
