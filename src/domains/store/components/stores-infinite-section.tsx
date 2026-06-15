'use client';

import { IconCheck } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import { InfiniteScrollSentinel } from '@/domains/products/components/infinite-scroll-sentinel';
import { StoresGridSkeleton } from '@/domains/store/components/store-cart-skeleton';
import { StoresVirtualList } from '@/domains/store/sections/store-virtual-list';
import { StoresGrid } from '@/domains/store/sections/stores-grid';
import type { ViewMode } from '@/domains/store/store.types';
import type { DtoStoreResponse } from '@/services/-stores-get.schemas';

interface StoresInfiniteSectionProps {
  stores: DtoStoreResponse[];
  total: number;
  view: ViewMode;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}

export function StoresInfiniteSection({
  stores,
  total,
  view,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore
}: StoresInfiniteSectionProps) {
  const loadedCount = stores.length;

  return (
    <>
      {loadedCount > 0 && (
        <p className='text-muted-foreground mb-4 text-sm'>
          Showing {loadedCount.toLocaleString('en-US')} of {total.toLocaleString('en-US')} stores
        </p>
      )}

      {view === 'grid' && <StoresGrid stores={stores} />}
      {view === 'compact' && <StoresGrid stores={stores} dense />}
      {view === 'list' && <StoresVirtualList stores={stores} />}

      {hasNextPage ? (
        <>
          <InfiniteScrollSentinel
            enabled={hasNextPage && !isFetchingNextPage}
            onIntersect={onLoadMore}
          />
          {isFetchingNextPage ? <StoresGridSkeleton count={3} /> : null}
          <div className='mt-6 flex justify-center'>
            <Button
              variant='outline'
              className='rounded-full px-8'
              disabled={isFetchingNextPage}
              onClick={onLoadMore}
            >
              {isFetchingNextPage ? 'Loading…' : 'Load more stores'}
            </Button>
          </div>
        </>
      ) : (
        loadedCount > 0 && (
          <div className='border-gold/15 bg-muted/20 mt-10 flex flex-col items-center gap-2 rounded-2xl border px-6 py-10 text-center'>
            <IconCheck className='text-gold h-8 w-8' />
            <p className='font-medium'>You&apos;ve seen all stores</p>
            <p className='text-muted-foreground text-sm'>
              {loadedCount.toLocaleString('en-US')} store{loadedCount === 1 ? '' : 's'} in this
              view
            </p>
          </div>
        )
      )}
    </>
  );
}
