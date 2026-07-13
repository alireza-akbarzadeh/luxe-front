import { Skeleton } from '@/components/ui/skeleton';
import {
  PRODUCT_CARD_HEIGHT_DEFAULT,
  PRODUCT_CARD_INFO_MIN_HEIGHT_DEFAULT,
  PRODUCT_CARD_INFO_TOP_RADIUS_DEFAULT
} from '@/domains/shop/lib/product-card-layout';

import { SEARCH_PRODUCT_GRID_CLASS, SEARCH_PRODUCT_LIST_CLASS } from '../lib/search-results-layout';

type SearchResultsView = 'grid' | 'list';

type SearchResultsSkeletonProps = {
  count?: number;
  view?: SearchResultsView;
};

/** Matches ProductCard — full-bleed image, rounded info sheet at bottom. */
function GridCardSkeleton() {
  return (
    <div
      className={`border-border/50 bg-card relative ${PRODUCT_CARD_HEIGHT_DEFAULT} w-full overflow-hidden rounded-2xl border shadow-sm`}
    >
      <div className='absolute inset-0 z-0'>
        <Skeleton className='h-full w-full rounded-none' />
        <Skeleton className='absolute end-2.5 top-2.5 size-9 rounded-full' />
      </div>
      <div
        className={`bg-card absolute inset-x-0 bottom-0 z-10 flex flex-col gap-1.5 p-4 pt-4 shadow-[0_-10px_28px_-6px_rgba(0,0,0,0.45)] ${PRODUCT_CARD_INFO_TOP_RADIUS_DEFAULT} ${PRODUCT_CARD_INFO_MIN_HEIGHT_DEFAULT}`}
      >
        <Skeleton className='h-2.5 w-14' />
        <Skeleton className='h-5 w-4/5' />
        <Skeleton className='h-3 w-28' />
        <div className='flex items-center gap-1.5'>
          <Skeleton className='size-3.5 rounded-full' />
          <Skeleton className='size-3.5 rounded-full' />
          <Skeleton className='size-3.5 rounded-full' />
        </div>
        <Skeleton className='h-4 w-16' />
        <div className='mt-auto flex gap-2 pt-2'>
          <Skeleton className='h-9 flex-1 rounded-lg' />
          <Skeleton className='h-9 flex-[1.2] rounded-lg' />
        </div>
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
 * Pixel-matched to `ProductGridList` — ProductCard (grid) / ProductListRow (list).
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
