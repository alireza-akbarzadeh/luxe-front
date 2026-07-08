'use client';

import { InfiniteMovingCards } from '@/components/card/infinite-moving-cards';
import type { DtoHomeBrandItem } from '@/services/-home-top-brands-get.schemas';

function toMarqueeItems(brands: DtoHomeBrandItem[]) {
  return brands
    .filter((brand) => (brand.name ?? '').trim().length > 0)
    .map((brand, index) => ({
      quote: brand.name ?? '',
      name: String(brand.id ?? brand.slug ?? index),
      title: ''
    }));
}

/** Premium moving brand cards for the storefront home page. */
export function HomeBrandsMarquee({ brands }: { brands: DtoHomeBrandItem[] }) {
  const items = toMarqueeItems(brands);

  if (items.length === 0) {
    return null;
  }

  return (
    <InfiniteMovingCards
      items={items}
      direction='right'
      speed='normal'
      variant='brand'
      pauseOnHover={false}
      className='max-w-none'
    />
  );
}
