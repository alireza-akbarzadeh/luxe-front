'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { SectionCarousel } from '@/components/section-carousel';
import { ProductCard } from '@/domains/shop/components/product-card';
import { toSuspenseOptions } from '@/lib/use-suspense-query';
import { getGetHomeNewArrivalsQueryOptions } from '@/services/-home-new-arrivals-get';

import { useHomeContent } from '../hooks/use-home-content';
import { mapHomeProductItem } from '../lib/home-utils';
import { ProductGridSkeleton } from './product-grid-skeleton';

const NEW_ARRIVALS_LIMIT = 5;

export function NewArrivalsSection() {
  const { t } = useHomeContent();

  const { data, isError } = useSuspenseQuery(
    toSuspenseOptions(
      getGetHomeNewArrivalsQueryOptions(
        { limit: NEW_ARRIVALS_LIMIT },
        {
          query: {
            select: (response) =>
              (response?.data?.products ?? []).slice(0, NEW_ARRIVALS_LIMIT).map(mapHomeProductItem)
          }
        }
      )
    )
  );

  const products = data ?? [];

  if (isError || products.length === 0) {
    return null;
  }

  return (
    <SectionCarousel
      sectionId='new-arrivals'
      eyebrow={t('newArrivals.eyebrow')}
      title={t('newArrivals.title')}
      description={t('newArrivals.description')}
      viewAllHref='/shop?sortBy=newest'
      viewAllLabel={t('newArrivals.linkLabel')}
      items={products}
      isLoading={false}
      columns={{ mobile: 2, tablet: 3, desktop: 4 }}
      skeletonCount={NEW_ARRIVALS_LIMIT}
      opts={{ align: 'start', loop: false, skipSnaps: false }}
      loop={false}
      renderSkeleton={() => <ProductGridSkeleton count={4} columns={4} />}
      renderItem={(product, index) => (
        <ProductCard product={product} index={index} size='compact' />
      )}
    />
  );
}
