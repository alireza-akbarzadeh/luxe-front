import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Suspense } from 'react';

import { StoreSkeleton } from '@/domains/store/components/store-skeleton-loading';
import { StoreDomain } from '@/domains/store/containers/store.domain';
import {
  getInfiniteStoreProductsQueryOptions,
  STORE_PRODUCTS_PAGE_SIZE
} from '@/domains/store/lib/infinite-store-products-query';
import { prefetchWithAuth } from '@/lib/prefetch-with-auth';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { getGetStoresSlugQueryOptions, getStoresSlug } from '@/services/-stores-{slug}-get';
import { getStoresSlugProducts } from '@/services/-stores-{slug}-products-get';

interface StorePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: StorePageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const response = await getStoresSlug(slug);
    const store = response.data;

    if (!store?.name) {
      return { title: 'Store Not Found' };
    }

    return buildPageMetadata({
      title: store.name,
      description:
        store.description?.replace(/\s+/g, ' ').trim().slice(0, 160) ??
        `Shop ${store.name} on Luxe — curated products from a verified seller.`,
      path: `/store/${slug}`,
      image: store.banner_url ?? store.logo_url
    });
  } catch {
    return { title: 'Store Not Found' };
  }
}

export default async function StorePage(props: StorePageProps) {
  const { slug } = await props.params;
  const queryClient = await prefetchWithAuth(getGetStoresSlugQueryOptions, slug);

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  const infiniteOptions = getInfiniteStoreProductsQueryOptions(slug, {});

  try {
    await queryClient.prefetchInfiniteQuery({
      ...infiniteOptions,
      queryFn: ({ pageParam, signal }) =>
        getStoresSlugProducts(
          slug,
          { limit: STORE_PRODUCTS_PAGE_SIZE, offset: pageParam },
          { headers: { Cookie: cookieHeader } },
          signal
        )
    });
  } catch {
    // Client will fetch if SSR prefetch fails.
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<StoreSkeleton />}>
        <StoreDomain slug={slug} />
      </Suspense>
    </HydrationBoundary>
  );
}
