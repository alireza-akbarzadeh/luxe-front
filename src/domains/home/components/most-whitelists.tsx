'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { SectionCarousel } from '@/components/section-carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCard } from '@/domains/shop/components/product-card';
import { toSuspenseOptions } from '@/lib/use-suspense-query';
import { getGetHomeMostWishlistedQueryOptions } from '@/services/-home-most-wishlisted-get';

import { useHomeContent } from '../hooks/use-home-content';

const PRODUCT_LIMIT = 12;

export function MostWhitelists() {
  const { t } = useHomeContent();

  const { data, isError } = useSuspenseQuery(
    toSuspenseOptions(getGetHomeMostWishlistedQueryOptions({ limit: PRODUCT_LIMIT }))
  );

  const wishlists = data?.data?.products ?? [];

  if (isError || wishlists.length === 0) {
    return null;
  }

  return (
    <SectionCarousel
      sectionId='wishlists'
      eyebrow={t('wishlists.eyebrow')}
      title={t('wishlists.title')}
      description={t('wishlists.description')}
      viewAllHref='/shop'
      viewAllLabel={t('common.shopAll')}
      items={wishlists}
      isLoading={false}
      columns={{ mobile: 1, tablet: 2, desktop: 4 }}
      opts={{ align: 'start', loop: false, skipSnaps: false }}
      skeletonCount={PRODUCT_LIMIT}
      renderSkeleton={() => <Skeleton className='aspect-4/5 w-full rounded-2xl' />}
      renderItem={(product, index) => (
        <ProductCard key={product.id ?? index} product={product} index={index} />
      )}
    />
  );
}
