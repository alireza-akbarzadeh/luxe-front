'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCard } from '@/domains/shop/components/product-card';
import { useGetHomeNewArrivals } from '@/services/-home-new-arrivals-get';
import { useGetHomeTopProducts } from '@/services/-home-top-products-get';
import { useGetHomeTrendingProducts } from '@/services/-home-trending-products-get';

import { useHomeContent } from '../hooks/use-home-content';
import { mapHomeProductItem, sectionContainerClass } from '../lib/home-utils';
import { ProductGridSkeleton } from './product-grid-skeleton';
import { SectionHeader } from './section-header';

type ProductTab = 'featured' | 'new' | 'trending';

const PRODUCT_LIMIT = 8;

export function FeaturedProducts() {
  const { t } = useHomeContent();
  const [tab, setTab] = useState<ProductTab>('featured');

  const topProducts = useGetHomeTopProducts(
    { limit: PRODUCT_LIMIT },
    { query: { enabled: tab === 'featured' } }
  );
  const newArrivals = useGetHomeNewArrivals(
    { limit: PRODUCT_LIMIT },
    { query: { enabled: tab === 'new' } }
  );
  const trendingProducts = useGetHomeTrendingProducts(
    { limit: PRODUCT_LIMIT },
    { query: { enabled: tab === 'trending' } }
  );

  const activeQuery =
    tab === 'featured' ? topProducts : tab === 'new' ? newArrivals : trendingProducts;

  const products = useMemo(() => {
    const items =
      tab === 'featured'
        ? topProducts.data?.data?.products
        : tab === 'new'
          ? newArrivals.data?.data?.products
          : trendingProducts.data?.data?.products;

    return (items ?? []).map(mapHomeProductItem);
  }, [tab, topProducts.data, newArrivals.data, trendingProducts.data]);

  const { isLoading } = activeQuery;

  return (
    <section id='products' className='py-16 sm:py-20 lg:py-28'>
      <div className={sectionContainerClass}>
        <SectionHeader
          eyebrow={t('featured.eyebrow')}
          title={t('featured.title')}
          description={t('featured.description')}
          href='/shop'
          linkLabel={t('common.shopAll')}
          align='left'
        />

        <Tabs value={tab} onValueChange={(v) => setTab(v as ProductTab)} className='mb-8 sm:mb-10'>
          <TabsList className='bg-muted/60 h-auto w-full justify-start gap-1 overflow-x-auto rounded-full p-1 sm:w-auto'>
            <TabsTrigger value='featured' className='rounded-full px-4 py-2 text-sm'>
              {t('featured.tabs.featured')}
            </TabsTrigger>
            <TabsTrigger value='new' className='rounded-full px-4 py-2 text-sm'>
              {t('featured.tabs.new')}
            </TabsTrigger>
            <TabsTrigger value='trending' className='rounded-full px-4 py-2 text-sm'>
              {t('featured.tabs.trending')}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading ? (
          <ProductGridSkeleton count={PRODUCT_LIMIT} />
        ) : products.length > 0 ? (
          <div className='grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4'>
            {products.map((product, index) => (
              <ProductCard key={product.id ?? index} product={product} index={index} />
            ))}
          </div>
        ) : null}

        <div className='flex-center mt-12 sm:mt-14'>
          <Button variant='outline' size='lg' className='rounded-full px-8' asChild>
            <Link href='/shop'>{t('common.viewAllProducts')}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
