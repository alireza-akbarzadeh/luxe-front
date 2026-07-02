'use client';

import { IconChevronRight } from '@tabler/icons-react';

import { DynamicBreadcrumb } from '@/components/breadcrumb-list';
import { Flex } from '@/components/ui/flex';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Typography } from '@/components/ui/typography';
import { formatOrderAmount } from '@/domains/account/lib/order-utils';
import type { SortOption } from '@/domains/wishlist/wishlist.store';

import { WishlistHeaderActions } from './wishlist-header-actions';

interface WishlistHeaderProps {
  itemLength: number;
  productIds: number[];
  isClearing: boolean;
  sortBy: SortOption;
  totalSavings: number;
  onClearAll: () => void;
  onSortChange: (value: SortOption) => void;
}

export function WishlistHeader({
  itemLength,
  productIds,
  isClearing,
  sortBy,
  totalSavings,
  onClearAll,
  onSortChange
}: Readonly<WishlistHeaderProps>) {
  return (
    <header className='mb-4 space-y-4 lg:mb-8'>
      <DynamicBreadcrumb
        items={[{ label: 'My Wishlist' }]}
        direction='column'
        separator={<IconChevronRight className='h-3 w-3' />}
        className='text-muted-foreground hidden text-xs sm:flex'
        breadcrumbClassName='flex items-center gap-1.5'
      />

      <Flex direction='column' gap={3} className='lg:gap-4'>
        <Flex align='start' justify='between' gap={3} className='w-full'>
          <div className='min-w-0'>
            <Typography.H1
              family='display'
              className='text-2xl font-semibold sm:text-3xl lg:text-4xl'
            >
              My Wishlist
            </Typography.H1>
            <Typography.Muted className='mt-1 hidden text-sm sm:block lg:text-base'>
              Products you&apos;ve saved with the heart icon — ready when you are.
            </Typography.Muted>
          </div>

          {itemLength > 0 ? (
            <WishlistHeaderActions
              itemLength={itemLength}
              productIds={productIds}
              isClearing={isClearing}
              onClearAll={onClearAll}
            />
          ) : null}
        </Flex>

        {itemLength > 0 ? (
          <Flex
            direction='column'
            gap={3}
            className='bg-muted/40 border-border/50 rounded-2xl border p-3 sm:flex-row sm:items-center sm:justify-between sm:border-0 sm:bg-transparent sm:p-0'
          >
            <Typography.Muted className='text-sm'>
              {itemLength} saved {itemLength === 1 ? 'item' : 'items'}
              {totalSavings > 0 ? (
                <>
                  {' '}
                  · save up to{' '}
                  <span className='text-accent font-medium'>{formatOrderAmount(totalSavings)}</span>
                </>
              ) : null}
            </Typography.Muted>

            <Select value={sortBy} onValueChange={(value) => onSortChange(value as SortOption)}>
              <SelectTrigger className='bg-background h-10 w-full rounded-full sm:w-[180px]'>
                <SelectValue placeholder='Sort by' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='name'>Name (A–Z)</SelectItem>
                <SelectItem value='price-asc'>Price: low to high</SelectItem>
                <SelectItem value='price-desc'>Price: high to low</SelectItem>
              </SelectContent>
            </Select>
          </Flex>
        ) : null}
      </Flex>
    </header>
  );
}
