'use client';

import { useMemo } from 'react';

import { ProductCard } from '@/domains/shop/components/product-card';
import { useGetProducts } from '~/src/services/-products-get';

import { mapProductForCard, resolveProducts, sectionContainerClass } from '../lib/home-utils';
import { ProductGridSkeleton } from './product-grid-skeleton';
import { SectionHeader } from './section-header';

export function NewArrivalsSection() {
  const { data, isLoading, isError } = useGetProducts({
    status: 'active',
    limit: 6,
    offset: 0,
    is_new: true,
    sort: 'newest'
  });

  const products = useMemo(
    () =>
      resolveProducts(data?.data?.products)
        .slice(0, 6)
        .map((element) => mapProductForCard(element)),
    [data?.data?.products]
  );

  const usingMock = isError || !data?.data?.products?.length;

  return (
    <section className='border-border/50 border-y py-16 sm:py-20 lg:py-28'>
      <div className={sectionContainerClass}>
        <SectionHeader
          eyebrow='Just dropped'
          title='New arrivals'
          description='Fresh finds added weekly — be first to shop limited releases and seasonal colorways.'
          href='/shop?sortBy=newest'
          linkLabel='See all new'
          align='left'
        />

        {usingMock && !isLoading && (
          <p className='text-muted-foreground -mt-6 mb-6 text-sm sm:mb-8'>
            Showing curated picks while we connect to the catalog.
          </p>
        )}

        {isLoading ? (
          <ProductGridSkeleton count={6} columns={6} />
        ) : (
          <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6 lg:gap-4'>
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
