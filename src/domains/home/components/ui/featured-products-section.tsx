'use client';

import { useMemo, useState } from 'react';

import { SectionCarousel } from '@/components/section-carousel';
import {
  FeaturedProductsTabs,
  type FeaturedProductTab
} from '@/domains/home/components/ui/featured-products-tabs';
import { HOME_PRODUCT_COLUMNS, HOME_RAIL_SECTION_CLASS } from '@/domains/home/lib/home-density';
import { ProductCard } from '@/domains/shop/components/product-card';
import type { DtoHomeProductItem } from '~/src/services/-home-categories-get.schemas';

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
  const tabOptions = useMemo(
    () =>
      (
        [
          { value: 'featured' as const, label: t.tabs.featured, products: featuredProducts },
          { value: 'new' as const, label: t.tabs.new, products: newProducts },
          { value: 'trending' as const, label: t.tabs.trending, products: trendingProducts }
        ] as const
      ).filter((entry) => entry.products.length > 0),
    [featuredProducts, newProducts, trendingProducts, t.tabs]
  );

  const [tab, setTab] = useState<FeaturedProductTab>(() => tabOptions[0]?.value ?? 'featured');

  const activeTab = tabOptions.some((entry) => entry.value === tab)
    ? tab
    : (tabOptions[0]?.value ?? 'featured');

  const products =
    tabOptions.find((entry) => entry.value === activeTab)?.products ?? featuredProducts;

  const tabsNode = (
    <FeaturedProductsTabs
      value={activeTab}
      onChange={setTab}
      tabs={tabOptions.map(({ value, label }) => ({ value, label }))}
    />
  );

  return (
    <SectionCarousel
      key={activeTab}
      sectionId='products'
      className={HOME_RAIL_SECTION_CLASS}
      eyebrow={t.eyebrow}
      title={t.title}
      description={t.description}
      viewAllHref='/shop'
      viewAllLabel={t.shopAll}
      columns={HOME_PRODUCT_COLUMNS}
      headerSlot={tabsNode}
      headerSlotClassName='mb-5 sm:mb-6'
      opts={{ align: 'start', loop: false, skipSnaps: false }}
    >
      {products.map((product, index) => (
        <ProductCard key={product.id ?? index} product={product} index={index} size='dense' />
      ))}
    </SectionCarousel>
  );
}
