// src/domains/home/components/featured-products-client.tsx (client)
'use client';

import { useState } from 'react';

import { SectionCarousel } from '@/components/section-carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCard } from '@/domains/shop/components/product-card';
import type { DtoHomeProductItem } from '~/src/services/-home-categories-get.schemas';

type ProductTab = 'featured' | 'new' | 'trending';

interface FeaturedProductsClientProps {
  featuredProducts: DtoHomeProductItem[];
  newProducts: DtoHomeProductItem[];
  trendingProducts: DtoHomeProductItem[];
  t: {
    eyebrow: string;
    title: string;
    description: string;
    tabs: {
      featured: string;
      new: string;
      trending: string;
    };
    shopAll: string;
  };
}

export function FeaturedProductsSection({
  featuredProducts,
  newProducts,
  trendingProducts,
  t
}: FeaturedProductsClientProps) {
  const [tab, setTab] = useState<ProductTab>('featured');

  const products = {
    featured: featuredProducts,
    new: newProducts,
    trending: trendingProducts
  }[tab];

  const tabsNode = (
    <Tabs value={tab} onValueChange={(v) => setTab(v as ProductTab)}>
      <TabsList className='bg-muted/60 h-auto w-full justify-start gap-1 overflow-x-auto rounded-full p-1 sm:w-auto'>
        <TabsTrigger value='featured' className='rounded-full px-4 py-2 text-sm'>
          {t.tabs.featured}
        </TabsTrigger>
        <TabsTrigger value='new' className='rounded-full px-4 py-2 text-sm'>
          {t.tabs.new}
        </TabsTrigger>
        <TabsTrigger value='trending' className='rounded-full px-4 py-2 text-sm'>
          {t.tabs.trending}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );

  return (
    <SectionCarousel
      sectionId='products'
      eyebrow={t.eyebrow}
      title={t.title}
      description={t.description}
      viewAllHref='/shop'
      viewAllLabel={t.shopAll}
      items={products}
      isLoading={false}
      columns={{ mobile: 1, tablet: 2, desktop: 4 }}
      headerSlot={tabsNode}
      opts={{ align: 'start', loop: false, skipSnaps: false }}
      skeletonCount={8}
      renderSkeleton={() => <Skeleton className='aspect-4/5 w-full rounded-2xl' />}
      renderItem={(product, index) => (
        <ProductCard key={product.id ?? index} product={product} index={index} />
      )}
    />
  );
}
