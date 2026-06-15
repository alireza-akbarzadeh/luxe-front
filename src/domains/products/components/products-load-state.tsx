'use client';

import { IconCheck, IconLoader2 } from '@tabler/icons-react';

import { Skeleton } from '@/components/ui/skeleton';

export function ProductsLoadMoreSkeleton() {
  return (
    <div className='mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className='border-border/60 space-y-3 overflow-hidden rounded-2xl border p-3'
        >
          <Skeleton className='aspect-4/5 w-full rounded-xl' />
          <Skeleton className='h-4 w-3/4' />
          <Skeleton className='h-4 w-1/3' />
          <Skeleton className='h-9 w-full rounded-full' />
        </div>
      ))}
    </div>
  );
}

interface ProductsEndStateProps {
  loadedCount: number;
}

export function ProductsEndState({ loadedCount }: ProductsEndStateProps) {
  return (
    <div className='border-border/60 bg-muted/20 mt-10 flex flex-col items-center gap-2 rounded-2xl border px-6 py-10 text-center'>
      <IconCheck className='text-accent h-8 w-8' />
      <p className='font-medium'>You&apos;ve seen it all</p>
      <p className='text-muted-foreground text-sm'>
        {loadedCount.toLocaleString('en-US')} product{loadedCount === 1 ? '' : 's'} in this view
      </p>
    </div>
  );
}

export function ProductsFetchingMore() {
  return (
    <div className='text-muted-foreground mt-8 flex items-center justify-center gap-2 text-sm'>
      <IconLoader2 className='h-4 w-4 animate-spin' />
      Loading more products…
    </div>
  );
}
