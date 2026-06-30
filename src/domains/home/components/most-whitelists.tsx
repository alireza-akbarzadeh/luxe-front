import { getTranslations } from 'next-intl/server';

import { SectionCarousel } from '@/components/section-carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCard } from '@/domains/shop/components/product-card';
import { getHomeMostWishlisted } from '~/src/services/-home-most-wishlisted-get';

const PRODUCT_LIMIT = 12;

export async function MostWhitelists() {
  const t = await getTranslations('home');

  const data = await getHomeMostWishlisted({ limit: PRODUCT_LIMIT });
  const wishlists = data?.data?.products ?? [];

  if (wishlists.length === 0) {
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
