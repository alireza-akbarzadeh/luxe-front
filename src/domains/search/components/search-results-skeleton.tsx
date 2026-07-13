import { Skeleton } from '@/components/ui/skeleton';

import { SEARCH_PRODUCT_GRID_CLASS, SEARCH_PRODUCT_LIST_CLASS } from '../lib/search-results-layout';

type SearchResultsView = 'grid' | 'list';

type SearchResultsSkeletonProps = {
  count?: number;
  view?: SearchResultsView;
};

/** Matches ProductCard: shorter image + info overlapping image bottom. */
function GridCardSkeleton() {
  return (
    <div className='border-border/50 bg-card overflow-hidden rounded-2xl border shadow-sm'>
      <Skeleton className='aspect-3/4 w-full rounded-2xl' />
      <div className='bg-card relative z-10 -mt-10 space-y-2 rounded-t-2xl p-4 pt-3.5'>
        <Skeleton className='h-2.5 w-14' />
        <Skeleton className='h-5 w-4/5' />
        <Skeleton className='h-3 w-28' />
        <div className='flex items-center gap-1.5'>
          <Skeleton className='size-3.5 rounded-full' />
          <Skeleton className='size-3.5 rounded-full' />
          <Skeleton className='size-3.5 rounded-full' />
        </div>
        <Skeleton className='mt-1 h-4 w-16' />
      </div>
    </div>
  );
}

function ListRowSkeleton() {
  return (
    <div className='bg-card flex gap-4 rounded-xl border p-4'>
      <Skeleton className='h-32 w-32 shrink-0 rounded-lg' />
      <div className='flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-center'>
        <div className='min-w-0 flex-1 space-y-2'>
          <Skeleton className='h-3 w-16' />
          <Skeleton className='h-5 w-[60%] max-w-xs' />
          <Skeleton className='h-4 w-[80%] max-w-md' />
          <div className='flex flex-wrap items-center gap-x-4 gap-y-1 pt-0.5'>
            <Skeleton className='h-4 w-16' />
            <Skeleton className='h-4 w-20' />
          </div>
        </div>
        <div className='flex shrink-0 items-center gap-2 sm:flex-col sm:justify-center'>
          <Skeleton className='size-10 rounded-md' />
          <Skeleton className='size-10 rounded-md' />
        </div>
      </div>
    </div>
  );
}

/**
 * Pixel-matched to `ProductGridList` — stacked ProductCard (grid) / ProductListRow (list).
 */
export function SearchResultsSkeleton({ count = 8, view = 'grid' }: SearchResultsSkeletonProps) {
  if (view === 'list') {
    return (
      <div className={SEARCH_PRODUCT_LIST_CLASS} aria-busy='true' aria-hidden>
        {Array.from({ length: count }).map((_, index) => (
          <ListRowSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className={SEARCH_PRODUCT_GRID_CLASS} aria-busy='true' aria-hidden>
      {Array.from({ length: count }).map((_, index) => (
        <GridCardSkeleton key={index} />
      ))}
    </div>
  );
}
