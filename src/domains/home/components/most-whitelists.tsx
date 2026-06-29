'use client';

import { SectionCarousel } from '@/components/section-carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCard } from '@/domains/shop/components/product-card';
import { useGetHomeMostWishlisted } from '~/src/services/-home-most-wishlisted-get';

import { useHomeContent } from '../hooks/use-home-content';

const PRODUCT_LIMIT = 12;

export function MostWhitelists() {
  const { t } = useHomeContent();

  const { data, isLoading, isError } = useGetHomeMostWishlisted({ limit: PRODUCT_LIMIT });

  const wishlists = data?.data?.products ?? [];

  if (!isLoading && (isError || wishlists.length === 0)) {
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
      isLoading={isLoading}
      columns={{ mobile: 1, tablet: 2, desktop: 4 }}
      opts={{ align: 'start', loop: false, skipSnaps: false }}
      renderItem={(product, index) => (
        <ProductCard key={product.id ?? index} product={product} index={index} />
      )}
      renderSkeleton={() => <Skeleton className='aspect-4/5 w-full rounded-2xl' />}
    />
  );
}
