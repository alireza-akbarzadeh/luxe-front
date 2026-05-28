'use client';
import { IconArrowRight, IconHeart } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';

import { Empty } from '@/components/empty';
import { Button } from '@/components/ui/button';
import { AnalyticalStats } from '~/src/domains/wishlist/components/analytical-stats';
import { useWishlistStore } from '~/src/domains/wishlist/wishlist.store';
import { useGetAccountWishlist } from '~/src/services/-account-wishlist-get';

import InteractiveActionToolbar from '~/src/domains/wishlist/components/interactive-action-toolbar';
import { StackWishlistItem } from '~/src/domains/wishlist/components/stack-wishlist-item';
import { RowWishlistItem } from '~/src/domains/wishlist/components/row-wishlist-item';
import { WishlistFooter } from '~/src/domains/wishlist/components/wishlist-footer';
import { WishlistHeader } from './components/wishlist-header';

export function WishlistDomain() {
  const { selectedItems, sortBy, viewMode } = useWishlistStore();

  const {
    data: response,
    isLoading,
    isError,
    error
  } = useGetAccountWishlist({
    limit: 50,
    offset: 0,
    sort: sortBy
  });

  const items = response?.data?.items ?? [];
  const totalItems = response?.data?.total ?? 0;

  const { totalSavings, priceDropsCount } = items.reduce(
    (accumulator, item) => {
      if (item.old_price && item.price && item.old_price > item.price) {
        accumulator.totalSavings += item.old_price - item.price;
        accumulator.priceDropsCount += 1;
      }
      return accumulator;
    },
    { totalSavings: 0, priceDropsCount: 0 }
  );

  if (isLoading) {
    return (
      <div className='app-container flex min-h-[400px] items-center justify-center py-8 pt-24'>
        <div className='text-muted-foreground animate-pulse text-sm'>Loading wishlist...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='app-container flex min-h-[400px] flex-col items-center justify-center gap-4 py-8 pt-24'>
        <p className='text-destructive font-medium'>Failed to load your wishlist</p>
        <p className='text-muted-foreground text-xs'>
          {error instanceof Error ? error.message : 'An unexpected error occurred.'}
        </p>
      </div>
    );
  }

  const isEmpty = items.length === 0;

  return (
    <div className='app-container space-y-4 py-8 pt-24'>
      <WishlistHeader itemLength={totalItems} />

      {isEmpty ? (
        <Empty
          title='Your wishlist is empty'
          description='Start saving items you love'
          icon={IconHeart}
          content={
            <Link href='/shop'>
              <Button size='lg' className='gap-2 rounded-full'>
                Explore Products
                <IconArrowRight className='h-4 w-4' />
              </Button>
            </Link>
          }
        />
      ) : (
        <>
          {/* Analytical Stats */}
          <AnalyticalStats
            priceDropsCount={priceDropsCount}
            totalItems={totalItems}
            totalSavings={totalSavings}
          />

          {/* Interactive Action Toolbar Component can go here */}
          <InteractiveActionToolbar items={items} />

          {/* Core Content Layout View Switcher */}
          <AnimatePresence mode='popLayout'>
            {viewMode === 'grid' ? (
              <motion.div
                layout
                className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              >
                {items.map((item, index) => {
                  if (!item.product_id) {
                    return null;
                  }
                  const isChecked = selectedItems.includes(item.product_id);

                  return (
                    <RowWishlistItem
                      key={item.product_id}
                      isChecked={isChecked}
                      item={item}
                      index={index}
                    />
                  );
                })}
              </motion.div>
            ) : (
              <motion.div layout className='space-y-4'>
                {items.map((item, index) => {
                  if (!item.product_id) {
                    return null;
                  }
                  const isChecked = selectedItems.includes(item.product_id);
                  return (
                    <StackWishlistItem
                      key={item.product_id}
                      isChecked={isChecked}
                      item={item}
                      index={index}
                    />
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
          <WishlistFooter />
        </>
      )}
    </div>
  );
}
