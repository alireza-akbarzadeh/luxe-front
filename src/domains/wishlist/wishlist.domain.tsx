'use client';

import { IconChevronRight } from '@tabler/icons-react';

import { DynamicBreadcrumb } from '@/components/breadcrumb-list';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { AccountWishlistItemCard } from '@/domains/account/components/account-wishlist-item-card';

import { WishlistEmptyState } from './components/wishlist-empty-state';
import { WishlistFooter } from './components/wishlist-footer';
import { WishlistGuestState } from './components/wishlist-guest-state';
import { WishlistHeader } from './components/wishlist-header';
import { WishlistItemRow } from './components/wishlist-item-row';
import { WishlistPageSkeleton } from './components/wishlist-page-skeleton';
import { useWishlistActions } from './hooks/use-wishlist-actions';
import { useWishlistStore } from './wishlist.store';

const wishlistMainClass = 'app-container pt-2 pb-6 sm:pt-6 sm:pb-10 lg:pt-8 lg:pb-16';

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
      <main className={wishlistMainClass}>
        <DynamicBreadcrumb
          items={[{ label: 'My Wishlist' }]}
          direction='column'
          separator={<IconChevronRight className='h-3 w-3' />}
          className='text-muted-foreground hidden text-xs sm:flex'
          breadcrumbClassName='flex items-center gap-1.5'
        />
        <Flex direction='column' align='center' className='mx-auto mt-12 max-w-lg text-center'>
          <Typography.H2 family='display' className='text-2xl font-semibold'>
            Couldn&apos;t load your wishlist
          </Typography.H2>
          <Typography.Muted className='mt-2 mb-6 text-sm'>
            Something went wrong while fetching your saved items. Please try again.
          </Typography.Muted>
          <Button onClick={() => void refetch()} className='rounded-full'>
            Retry
          </Button>
        </Flex>
      </main>
    );
  }

  if (total === 0) {
    return (
      <main className={wishlistMainClass}>
        <WishlistHeader
          itemLength={0}
          productIds={[]}
          isClearing={false}
          sortBy={sortBy}
          totalSavings={0}
          onClearAll={() => {}}
          onSortChange={setSortBy}
        />
        <WishlistEmptyState />
      </main>
    );
  }

  return (
    <main className={wishlistMainClass}>
      <WishlistHeader
        itemLength={total}
        productIds={productIds}
        isClearing={isClearing}
        sortBy={sortBy}
        totalSavings={totalSavings}
        onClearAll={() => void clearAll(productIds)}
        onSortChange={setSortBy}
      />

      <ul className='flex flex-col gap-3 lg:hidden'>
        {items.map((item) =>
          item.product_id ? (
            <WishlistItemRow
              key={item.product_id}
              item={item}
              isRemoving={removingProductId === item.product_id}
              onRemove={(productId) => void removeItem(productId)}
            />
          ) : null
        )}
      </ul>

      <div className='hidden grid-cols-2 gap-4 md:grid-cols-3 lg:grid lg:grid-cols-4'>
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
