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

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Popular' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top rated' }
] as const;

interface CollectionProductsToolbarProps {
  totalProducts: number;
  isFetching: boolean;
  sortBy: string;
  onSortChange: (sort: 'newest' | 'popular' | 'price-asc' | 'price-desc' | 'rating') => void;
}

/** Result count and sort controls for collection products. */
export function CollectionProductsToolbar({
  totalProducts,
  isFetching,
  sortBy,
  onSortChange
}: CollectionProductsToolbarProps) {
  return (
    <Flex
      direction='row'
      align='center'
      justify='between'
      gap={3}
      wrap='wrap'
      className='border-b pb-4'
    >
      <Typography.Small className='text-muted-foreground'>
        <span className='text-foreground font-medium'>{totalProducts.toLocaleString('en-US')}</span>{' '}
        products
        {isFetching ? <span className='text-gold ms-2 text-xs'>updating…</span> : null}
      </Typography.Small>

      <Select
        value={sortBy}
        onValueChange={(value) =>
          onSortChange(value as 'newest' | 'popular' | 'price-asc' | 'price-desc' | 'rating')
        }
      >
        <SelectTrigger className='w-[12rem] rounded-full'>
          <SelectValue placeholder='Sort by' />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              Sort by: {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Flex>
  );
}
