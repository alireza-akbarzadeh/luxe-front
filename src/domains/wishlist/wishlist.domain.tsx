'use client';

import { IconChevronRight } from '@tabler/icons-react';

import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { DynamicBreadcrumb } from '~/src/components/breadcrumb-list';
import { AccountWishlistItemCard } from '~/src/domains/account/components/account-wishlist-item-card';
import { formatOrderAmount } from '~/src/domains/account/lib/order-utils';
import { useWishlistActions } from '~/src/domains/wishlist/hooks/use-wishlist-actions';
import { type SortOption, useWishlistStore } from '~/src/domains/wishlist/wishlist.store';

import { WishlistEmptyState } from './components/wishlist-empty-state';
import { WishlistFooter } from './components/wishlist-footer';
import { WishlistGuestState } from './components/wishlist-guest-state';
import { WishlistHeader } from './components/wishlist-header';
import { WishlistPageSkeleton } from './components/wishlist-page-skeleton';

export function WishlistDomain() {
  const { isAuthenticated } = useAuth();
  const { sortBy, setSortBy } = useWishlistStore();
  const {
    items,
    total,
    isLoading,
    isError,
    refetch,
    removingProductId,
    isClearing,
    removeItem,
    clearAll
  } = useWishlistActions(sortBy, isAuthenticated);

  if (!isAuthenticated) {
    return <WishlistGuestState />;
  }

  const productIds = items
    .map((item) => item.product_id)
    .filter((id): id is number => typeof id === 'number' && id > 0);

  const totalSavings = items.reduce((sum, item) => {
    if (item.old_price && item.price && item.old_price > item.price) {
      return sum + (item.old_price - item.price);
    }
    return sum;
  }, 0);

  if (isLoading) {
    return <WishlistPageSkeleton />;
  }

  if (isError) {
    return (
      <main className='app-container pt-24 pb-16'>
        <DynamicBreadcrumb
          items={[{ label: 'My Wishlist' }]}
          direction='column'
          separator={<IconChevronRight className='h-3 w-3' />}
          className='text-muted-foreground text-xs'
          breadcrumbClassName='flex items-center gap-1.5'
        />
        <div className='mx-auto mt-16 max-w-lg text-center'>
          <h1 className='font-display mb-2 text-2xl font-semibold'>Couldn&apos;t load your wishlist</h1>
          <p className='text-muted-foreground mb-6 text-sm'>
            Something went wrong while fetching your saved items. Please try again.
          </p>
          <Button onClick={() => void refetch()} className='rounded-full'>
            Retry
          </Button>
        </div>
      </main>
    );
  }

  if (total === 0) {
    return (
      <main className='app-container pt-24 pb-16'>
        <WishlistHeader
          itemLength={0}
          productIds={[]}
          isClearing={false}
          onClearAll={() => {}}
        />
        <WishlistEmptyState />
      </main>
    );
  }

  return (
    <main className='app-container pt-24 pb-16'>
      <WishlistHeader
        itemLength={total}
        productIds={productIds}
        isClearing={isClearing}
        onClearAll={() => void clearAll(productIds)}
      />

      <div className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <p className='text-muted-foreground text-sm'>
          {total} saved {total === 1 ? 'item' : 'items'}
          {totalSavings > 0 ? (
            <>
              {' '}
              · save up to{' '}
              <span className='text-accent font-medium'>{formatOrderAmount(totalSavings)}</span>{' '}
              on current prices
            </>
          ) : null}
        </p>

        <Select
          value={sortBy}
          onValueChange={(value) => {
            setSortBy(value as SortOption);
          }}
        >
          <SelectTrigger className='w-[180px] rounded-full'>
            <SelectValue placeholder='Sort by' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='name'>Name (A–Z)</SelectItem>
            <SelectItem value='price-asc'>Price: low to high</SelectItem>
            <SelectItem value='price-desc'>Price: high to low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
        {items.map((item) =>
          item.product_id ? (
            <AccountWishlistItemCard
              key={item.product_id}
              item={item}
              isRemoving={removingProductId === item.product_id}
              onRemove={(productId) => void removeItem(productId)}
            />
          ) : null
        )}
      </div>

      <WishlistFooter />
    </main>
  );
}
