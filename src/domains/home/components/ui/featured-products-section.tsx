// src/domains/home/components/featured-products-client.tsx (client)
'use client';

import { useState } from 'react';

import { SectionCarousel } from '@/components/section-carousel';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HOME_PRODUCT_COLUMNS, HOME_RAIL_SECTION_CLASS } from '@/domains/home/lib/home-density';
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
      className={HOME_RAIL_SECTION_CLASS}
      eyebrow={t.eyebrow}
      title={t.title}
      description={t.description}
      viewAllHref='/shop'
      viewAllLabel={t.shopAll}
      columns={HOME_PRODUCT_COLUMNS}
      headerSlot={tabsNode}
      opts={{ align: 'start', loop: false, skipSnaps: false }}
    >
      {products.map((product, index) => (
        <ProductCard key={product.id ?? index} product={product} index={index} size='dense' />
      ))}
    </SectionCarousel>
  );
}
