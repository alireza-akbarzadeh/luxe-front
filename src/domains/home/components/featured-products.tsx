'use client';

import { useMemo, useState } from 'react';

import { SectionCarousel } from '@/components/section-carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCard } from '@/domains/shop/components/product-card';
import { useGetHomeNewArrivals } from '@/services/-home-new-arrivals-get';
import { useGetHomeTopProducts } from '@/services/-home-top-products-get';
import { useGetHomeTrendingProducts } from '@/services/-home-trending-products-get';

import { useHomeContent } from '../hooks/use-home-content';
import { mapHomeProductItem } from '../lib/home-utils';

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

  // Tabs node passed as a header slot so SectionCarousel owns the full layout
  const tabsNode = (
    <Tabs value={tab} onValueChange={(v) => setTab(v as ProductTab)}>
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
  );

  return (
    <SectionCarousel
      sectionId='products'
      eyebrow={t('featured.eyebrow')}
      title={t('featured.title')}
      description={t('featured.description')}
      viewAllHref='/shop'
      viewAllLabel={t('common.shopAll')}
      items={products}
      isLoading={activeQuery.isLoading}
      columns={{ mobile: 1, tablet: 2, desktop: 4 }}
      headerSlot={tabsNode}
      opts={{ align: 'start', loop: false, skipSnaps: false }}
      renderItem={(product, index) => (
        <ProductCard key={product.id ?? index} product={product} index={index} />
      )}
      renderSkeleton={() => <Skeleton className='aspect-4/5 w-full rounded-2xl' />}
    />
  );
}
