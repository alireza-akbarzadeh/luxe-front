'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import { SectionCarousel } from '@/components/section-carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCard } from '@/domains/shop/components/product-card';
import { toSuspenseOptions } from '@/lib/use-suspense-query';
import { getGetHomeNewArrivalsQueryOptions } from '@/services/-home-new-arrivals-get';
import { getGetHomeTopProductsQueryOptions } from '@/services/-home-top-products-get';
import { getGetHomeTrendingProductsQueryOptions } from '@/services/-home-trending-products-get';

import { useHomeContent } from '../hooks/use-home-content';
import { mapHomeProductItem } from '../lib/home-utils';

type ProductTab = 'featured' | 'new' | 'trending';

const PRODUCT_LIMIT = 8;

export function FeaturedProducts() {
  const { t } = useHomeContent();
  const [tab, setTab] = useState<ProductTab>('featured');

  const topProducts = useSuspenseQuery(
    toSuspenseOptions(getGetHomeTopProductsQueryOptions({ limit: PRODUCT_LIMIT }))
  );

  const newArrivals = useSuspenseQuery(
    toSuspenseOptions(getGetHomeNewArrivalsQueryOptions({ limit: PRODUCT_LIMIT }))
  );

  const trendingProducts = useSuspenseQuery(
    toSuspenseOptions(getGetHomeTrendingProductsQueryOptions({ limit: PRODUCT_LIMIT }))
  );

  const products = useMemo(() => {
    switch (tab) {
      case 'featured':
        return (topProducts.data.data?.products ?? []).map(mapHomeProductItem);

      case 'new':
        return (newArrivals.data.data?.products ?? []).map(mapHomeProductItem);

      case 'trending':
        return (trendingProducts.data.data?.products ?? []).map(mapHomeProductItem);

      default:
        return [];
    }
  }, [tab, topProducts.data, newArrivals.data, trendingProducts.data]);

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
      isLoading={false}
      columns={{ mobile: 1, tablet: 2, desktop: 4 }}
      headerSlot={tabsNode}
      opts={{ align: 'start', loop: false, skipSnaps: false }}
      skeletonCount={PRODUCT_LIMIT}
      renderSkeleton={() => <Skeleton className='aspect-4/5 w-full rounded-2xl' />}
      renderItem={(product, index) => (
        <ProductCard key={product.id ?? index} product={product} index={index} />
      )}
    />
  );
}
