import { getTranslations } from 'next-intl/server';

import { SectionCarousel } from '@/components/section-carousel';
import { ProductCard } from '@/domains/shop/components/product-card';
import { getHomeNewArrivals } from '@/services/-home-new-arrivals-get';

import { ProductGridSkeleton } from './product-grid-skeleton';

const NEW_ARRIVALS_LIMIT = 5;

export async function NewArrivalsSection() {
  const t = await getTranslations('home');

  const data = await getHomeNewArrivals({ limit: NEW_ARRIVALS_LIMIT });
  const products = data?.data?.products ?? [];

  if (products.length === 0) {
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
