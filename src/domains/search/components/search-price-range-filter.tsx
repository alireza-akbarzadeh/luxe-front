'use client';

import { useState } from 'react';

import { Slider } from '@/components/ui/slider';
import { cartMoneyClassName } from '@/domains/cart/lib/cart-utils';
import { formatPrice } from '@/domains/home/lib/home-utils';
import { cn } from '@/lib/utils';

import { useSearchParams } from '../hooks/useSearchParams';
import {
  SEARCH_DEFAULT_PRICE_MAX,
  SEARCH_DEFAULT_PRICE_MIN,
  SEARCH_PRICE_STEP
} from '../search.utils';

interface SearchPriceRangeFilterProps {
  /** Controlled draft value — skips URL updates until parent applies. */
  value?: [number, number];
  onChange?: (range: [number, number]) => void;
}

/**
 * Price range slider with local drag state.
 * URL updates on release in sidebar mode; draft mode delegates to parent only.
 */
export function SearchPriceRangeFilter(props: SearchPriceRangeFilterProps = {}) {
  const { value, onChange } = props;
  const searchParams = useSearchParams();
  const committedRange = value ?? searchParams.priceRange;
  const isDraftMode = value != null && onChange != null;

  const [localRange, setLocalRange] = useState<[number, number]>(committedRange);
  const [syncedRange, setSyncedRange] = useState(committedRange);

  if (committedRange[0] !== syncedRange[0] || committedRange[1] !== syncedRange[1]) {
    setSyncedRange(committedRange);
    setLocalRange(committedRange);
  }

  const handleValueChange = (values: number[]) => {
    setLocalRange([values[0] ?? SEARCH_DEFAULT_PRICE_MIN, values[1] ?? SEARCH_DEFAULT_PRICE_MAX]);
  };

  const handleValueCommit = (values: number[]) => {
    const next: [number, number] = [
      values[0] ?? SEARCH_DEFAULT_PRICE_MIN,
      values[1] ?? SEARCH_DEFAULT_PRICE_MAX
    ];
    setLocalRange(next);

    if (isDraftMode) {
      onChange(next);
      return;
    }

    searchParams.setPriceRange(next);
  };

  return (
    <div>
      <div className='mb-3 flex items-center justify-between gap-2'>
        <h3 className='font-semibold'>Price Range</h3>
        <span className={cn('text-muted-foreground text-xs', cartMoneyClassName)}>
          {isDraftMode ? 'Adjust range' : 'Drag to adjust · release to apply'}
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
