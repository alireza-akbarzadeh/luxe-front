'use client';

import { IconArrowRight, IconSparkles } from '@tabler/icons-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { ChevronButton } from '@/components/section-carousel/chevron-button';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import {
  FeaturedProductsTabs,
  type FeaturedProductTab
} from '@/domains/home/components/ui/featured-products-tabs';
import {
  FeaturedProductsTrustStrip,
  type FeaturedTrustItem
} from '@/domains/home/components/ui/featured-products-trust-strip';
import { HOME_RAIL_SECTION_CLASS } from '@/domains/home/lib/home-density';
import { ProductCard } from '@/domains/shop/components/product-card';
import { useCarouselState } from '@/hooks/useCarouselState';
import { cn } from '@/lib/utils';
import type { DtoHomeProductItem } from '~/src/services/-home-categories-get.schemas';

interface FeaturedProductsClientProps {
  featuredProducts: DtoHomeProductItem[];
  newProducts: DtoHomeProductItem[];
  trendingProducts: DtoHomeProductItem[];
  trustItems: FeaturedTrustItem[];
  t: {
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
  trustItems,
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

  const { setApi, scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarouselState();

  return (
    <section id='products' className={cn(HOME_RAIL_SECTION_CLASS, 'py-8 sm:py-10')}>
      <div className='app-container'>
        <div
          className={cn(
            'overflow-hidden rounded-2xl border p-4 sm:p-5 lg:p-6',
            'border-border/50 bg-[#f3ede4]/90 dark:border-white/10 dark:bg-[#1a1a1a]'
          )}
        >
          <Flex direction='row' align='center' justify='between' gap={3}>
            <Flex direction='row' align='center' gap={2} className='min-w-0'>
              <Flex
                align='center'
                justify='center'
                className='bg-gold/15 text-gold size-9 shrink-0 rounded-full'
              >
                <IconSparkles className='size-4' stroke={1.75} />
              </Flex>
              <Typography.H2
                family='display'
                className='text-foreground truncate text-lg font-semibold sm:text-xl'
              >
                {t.title}
              </Typography.H2>
            </Flex>

            <Link
              href='/shop'
              className='text-gold hover:text-gold/80 inline-flex shrink-0 items-center gap-1 text-sm font-medium transition-colors'
            >
              {t.shopAll}
              <IconArrowRight className='cn-rtl-flip size-4' />
            </Link>
          </Flex>

          <Typography.Muted className='border-border/60 bg-background/75 mt-3 rounded-xl border px-3 py-2.5 text-xs leading-relaxed sm:text-sm dark:bg-white/5'>
            {t.description}
          </Typography.Muted>

          <FeaturedProductsTabs
            value={activeTab}
            onChange={setTab}
            tabs={tabOptions.map(({ value, label }) => ({ value, label }))}
          />

          <div className='relative mt-4'>
            <Flex
              direction='row'
              align='center'
              justify='end'
              gap={2}
              className='absolute end-0 -top-11 z-10 hidden sm:flex'
            >
              <ChevronButton direction='prev' onClick={scrollPrev} disabled={!canScrollPrev} />
              <ChevronButton direction='next' onClick={scrollNext} disabled={!canScrollNext} />
            </Flex>

            <Carousel
              key={activeTab}
              setApi={setApi}
              opts={{ align: 'start', loop: false, dragFree: true }}
              className='w-full'
            >
              <CarouselContent className='-ms-3'>
                {products.map((product, index) => (
                  <CarouselItem
                    key={product.id ?? index}
                    className='basis-[46%] ps-3 sm:basis-[34%] lg:basis-[19%]'
                  >
                    <ProductCard product={product} index={index} size='dense' />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            <Flex
              direction='row'
              align='center'
              justify='center'
              gap={2}
              className='mt-3 sm:hidden'
            >
              <ChevronButton direction='prev' onClick={scrollPrev} disabled={!canScrollPrev} />
              <ChevronButton direction='next' onClick={scrollNext} disabled={!canScrollNext} />
            </Flex>
          </div>

          <FeaturedProductsTrustStrip items={trustItems} />
        </div>
      </div>
    </section>
  );
}
