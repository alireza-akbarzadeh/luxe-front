'use client';

import { ProductCard } from '@/domains/shop/components/product-card';
import { useGetProducts } from '~/src/services/-products-get';

import { useHomeContent } from '../hooks/use-home-content';
import { mapProductForCard, resolveProducts, sectionContainerClass } from '../lib/home-utils';
import { ProductGridSkeleton } from './product-grid-skeleton';
import { SectionHeader } from './section-header';

export function NewArrivalsSection() {
  const { t } = useHomeContent();
  const { data, isLoading, isError } = useGetProducts(
    {
      status: 'active',
      limit: 5,
      offset: 0,
      is_new: true,
      sort: 'newest'
    },
    {
      query: {
        select: (response) => {
          return resolveProducts(response?.data?.products)
            ?.slice(0, 5)
            .map((element) => mapProductForCard(element));
        }
      }
    }
  );

  const products = data ?? [];
  const usingMock = isError || !data?.length;

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

        {usingMock && !isLoading && (
          <p className='text-muted-foreground -mt-6 mb-6 text-sm sm:mb-8'>
            {t('common.catalogMockNotice')}
          </p>
        )}

        {isLoading ? (
          <ProductGridSkeleton count={5} columns={5} />
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
