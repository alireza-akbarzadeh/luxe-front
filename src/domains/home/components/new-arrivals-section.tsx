'use client';

import { ProductCard } from '@/domains/shop/components/product-card';
import { useGetHomeNewArrivals } from '@/services/-home-new-arrivals-get';

import { useHomeContent } from '../hooks/use-home-content';
import { mapHomeProductItem, sectionContainerClass } from '../lib/home-utils';
import { ProductGridSkeleton } from './product-grid-skeleton';
import { SectionHeader } from './section-header';

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
    <section className='border-border/50 border-y py-16 sm:py-20 lg:py-28'>
      <div className={sectionContainerClass}>
        <SectionHeader
          eyebrow={t('newArrivals.eyebrow')}
          title={t('newArrivals.title')}
          description={t('newArrivals.description')}
          href='/shop?sortBy=newest'
          linkLabel={t('newArrivals.linkLabel')}
          align='left'
        />

        {isLoading ? (
          <ProductGridSkeleton count={NEW_ARRIVALS_LIMIT} columns={5} />
        ) : (
          <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5 lg:gap-4'>
            {products.map((product, index) => (
              <ProductCard
                key={product.id ?? index}
                product={product}
                index={index}
                size='compact'
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
