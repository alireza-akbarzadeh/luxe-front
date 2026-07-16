'use client';

import { Flex } from '@/components/ui/flex';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Typography } from '@/components/ui/typography';
import type { BrandProductSort } from '@/domains/brands/types/brands.types';

const SORT_OPTIONS: Array<{ value: BrandProductSort; label: string }> = [
  { value: 'popular', label: 'Popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top rated' }
];

interface BrandProductsToolbarProps {
  totalProducts: number;
  isFetching: boolean;
  sortBy: BrandProductSort;
  onSortChange: (sort: BrandProductSort) => void;
}

/** Result count + sort control above the brand product grid. */
export function BrandProductsToolbar({
  totalProducts,
  isFetching,
  sortBy,
  onSortChange
}: BrandProductsToolbarProps) {
  return (
    <Flex
      direction='row'
      align='center'
      justify='between'
      gap={3}
      wrap='wrap'
      className='border-border/50 border-b pb-4'
    >
      <Typography.Small className='text-muted-foreground'>
        <span className='text-foreground font-medium'>{totalProducts.toLocaleString('en-US')}</span>{' '}
        products
        {isFetching ? <span className='text-gold ms-2 text-xs'>updating…</span> : null}
      </Typography.Small>

      <Select value={sortBy} onValueChange={(v) => onSortChange(v as BrandProductSort)}>
        <SelectTrigger className='w-[11.5rem] rounded-full'>
          <SelectValue placeholder='Sort by' />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              Sort by: {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Flex>
  );
}
