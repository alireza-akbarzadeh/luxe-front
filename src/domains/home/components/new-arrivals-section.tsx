'use client';

import { motion } from 'framer-motion';

import { SectionCarousel } from '@/components/section-carousel';
import { ProductCard } from '@/domains/shop/components/product-card';
import { useGetHomeNewArrivals } from '@/services/-home-new-arrivals-get';

import { useHomeContent } from '../hooks/use-home-content';
import { mapHomeProductItem } from '../lib/home-utils';
import { ProductGridSkeleton } from './product-grid-skeleton';

const NEW_ARRIVALS_LIMIT = 5;

export function NewArrivalsSection() {
  const { t } = useHomeContent();

  const { data, isLoading, isError } = useGetHomeNewArrivals(
    { limit: NEW_ARRIVALS_LIMIT },
    {
      query: {
        select: (response) =>
          (response?.data?.products ?? []).slice(0, NEW_ARRIVALS_LIMIT).map(mapHomeProductItem)
      }
    }
  );

  const products = data ?? [];

  if (!isLoading && (isError || products.length === 0)) {
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
      isLoading={isLoading}
      columns={{ mobile: 2, tablet: 3, desktop: 4 }}
      skeletonCount={NEW_ARRIVALS_LIMIT}
      opts={{ align: 'start', loop: false, skipSnaps: false }}
      loop={false}
      renderSkeleton={() => <ProductGridSkeleton count={4} columns={4} />}
      renderItem={(product, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, delay: index * 0.05 }}
        >
          <ProductCard product={product} index={index} size='compact' />
        </motion.div>
      )}
    />
  );
}
