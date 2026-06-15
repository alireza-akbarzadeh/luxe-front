'use client';

import { useEffect, useState } from 'react';

import { Slider } from '@/components/ui/slider';
import { formatPrice } from '@/domains/home/lib/home-utils';
import { cartMoneyClassName } from '@/domains/cart/lib/cart-utils';
import { cn } from '@/lib/utils';

import { useSearchParams } from '../hooks/useSearchParams';
import {
  SEARCH_DEFAULT_PRICE_MAX,
  SEARCH_DEFAULT_PRICE_MIN,
  SEARCH_PRICE_STEP
} from '../search.utils';

/**
 * Price range slider with local drag state.
 * URL (and search API) update only when the user releases a thumb — not on every move.
 */
export function SearchPriceRangeFilter() {
  const searchParams = useSearchParams();
  const committedRange = searchParams.priceRange;

  const [localRange, setLocalRange] = useState<[number, number]>(committedRange);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isDragging) {
      setLocalRange(committedRange);
    }
  }, [committedRange[0], committedRange[1], isDragging]);

  const handleValueChange = (values: number[]) => {
    setIsDragging(true);
    setLocalRange([values[0] ?? SEARCH_DEFAULT_PRICE_MIN, values[1] ?? SEARCH_DEFAULT_PRICE_MAX]);
  };

  const handleValueCommit = (values: number[]) => {
    const next: [number, number] = [
      values[0] ?? SEARCH_DEFAULT_PRICE_MIN,
      values[1] ?? SEARCH_DEFAULT_PRICE_MAX
    ];
    setLocalRange(next);
    setIsDragging(false);
    searchParams.setPriceRange(next);
  };

  return (
    <div>
      <div className='mb-3 flex items-center justify-between gap-2'>
        <h3 className='font-semibold'>Price Range</h3>
        <span className={cn('text-muted-foreground text-xs', cartMoneyClassName)}>
          Drag to adjust · release to apply
        </span>
      </div>
      <Slider
        value={localRange}
        min={SEARCH_DEFAULT_PRICE_MIN}
        max={SEARCH_DEFAULT_PRICE_MAX}
        step={SEARCH_PRICE_STEP}
        minStepsBetweenThumbs={SEARCH_PRICE_STEP}
        onValueChange={handleValueChange}
        onValueCommit={handleValueCommit}
        className='mb-3'
        aria-label='Price range filter'
      />
      <div className={cn('flex items-center justify-between text-sm', cartMoneyClassName)}>
        <span>{formatPrice(localRange[0])}</span>
        <span className='text-muted-foreground'>–</span>
        <span>{formatPrice(localRange[1])}</span>
      </div>
    </div>
  );
}
