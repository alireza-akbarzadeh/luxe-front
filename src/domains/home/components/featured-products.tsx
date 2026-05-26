'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetProducts } from '~/src/services/-products-get';
import type { GetProductsParams } from '~/src/services/-products-get.schemas';
import { ProductCard } from '@/domains/shop/components/product-card';
import { SectionHeader } from './section-header';
import { ProductGridSkeleton } from './product-grid-skeleton';
import { mapProductForCard, resolveProducts, sectionContainerClass } from '../lib/home-utils';

type ProductTab = 'featured' | 'new' | 'trending';

const TAB_PARAMS: Record<ProductTab, GetProductsParams> = {
  featured: { status: 'active', limit: 8, offset: 0, sort: 'rating_desc' },
  new: { status: 'active', limit: 8, offset: 0, is_new: true, sort: 'newest' },
  trending: { status: 'active', limit: 8, offset: 0, sort: 'reviews_desc' }
};

export function FeaturedProducts() {
  const [tab, setTab] = useState<ProductTab>('featured');
  const params = TAB_PARAMS[tab];

  const { data, isLoading, isError } = useGetProducts(params);

  const products = useMemo(
    () => resolveProducts(data?.data?.products).map(mapProductForCard),
    [data?.data?.products]
  );

  const usingMock = isError || !data?.data?.products?.length;

  return (
    <section id='products' className='py-16 sm:py-20 lg:py-28'>
      <div className={sectionContainerClass}>
        <SectionHeader
          eyebrow='Curated for you'
          title='Featured products'
          description='Handpicked pieces our stylists love this season — refined materials, modern silhouettes, and lasting value.'
          href='/shop'
          linkLabel='Shop all'
          align='left'
        />

        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as ProductTab)}
          className='mb-8 sm:mb-10'
        >
          <TabsList className='bg-muted/60 h-auto w-full justify-start gap-1 overflow-x-auto rounded-full p-1 sm:w-auto'>
            <TabsTrigger value='featured' className='rounded-full px-4 py-2 text-sm'>
              Featured
            </TabsTrigger>
            <TabsTrigger value='new' className='rounded-full px-4 py-2 text-sm'>
              New in
            </TabsTrigger>
            <TabsTrigger value='trending' className='rounded-full px-4 py-2 text-sm'>
              Trending
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {usingMock && !isLoading && (
          <p className='text-muted-foreground mb-6 text-sm'>
            Showing curated picks while we connect to the catalog.
          </p>
        )}

        {isLoading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <div className='grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4'>
            {products.map((product, index) => (
              <ProductCard key={product.id ?? index} product={product} index={index} />
            ))}
          </div>
        )}

        <div className='mt-12 flex-center sm:mt-14'>
          <Button variant='outline' size='lg' className='rounded-full px-8' asChild>
            <Link href='/shop'>View all products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
