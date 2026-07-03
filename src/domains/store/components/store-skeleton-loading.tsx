import { Skeleton } from '@/components/ui/skeleton';

export function StoreHeaderSkeleton() {
  return (
    <section className='relative pt-20'>
      <Skeleton className='h-48 w-full md:h-64' />
      <div className='app-container relative -mt-16'>
        <div className='flex flex-col items-start gap-4 md:flex-row md:items-end md:gap-6'>
          <Skeleton className='h-24 w-24 rounded-2xl md:h-32 md:w-32' />
          <div className='flex-1 space-y-3'>
            <Skeleton className='h-8 w-48' />
            <Skeleton className='h-4 w-full max-w-2xl' />
            <div className='flex gap-4'>
              <Skeleton className='h-4 w-20' />
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-4 w-28' />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function StoreProductsGridSkeleton() {
  return (
    <div className='grid w-full grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4'>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className='space-y-3 rounded-2xl border p-4'>
          <Skeleton className='aspect-4/5 w-full' />
          <Skeleton className='h-4 w-3/4' />
          <Skeleton className='h-4 w-1/2' />
        </div>
      ))}
    </div>
  );
}

export function StoreSkeleton() {
  return (
    <>
      <StoreHeaderSkeleton />
      <section className='py-8'>
        <div className='app-container'>
          <div className='mb-6 flex justify-between'>
            <Skeleton className='h-10 w-80' />
            <div className='flex gap-3'>
              <Skeleton className='h-10 w-24' />
              <Skeleton className='h-10 w-20' />
            </div>
          </div>
          <div className='flex gap-8'>
            <aside className='hidden w-64 lg:block'>
              <div className='space-y-6'>
                <Skeleton className='h-8 w-full' />
                <Skeleton className='h-32 w-full' />
              </div>
            </aside>
            <StoreProductsGridSkeleton />
          </div>
        </div>
      </section>
    </>
  );
}

/** Matches StoreReviewForm card — avoids layout shift while loading user's review. */
export function StoreReviewFormSkeleton() {
  return (
    <div className='border-gold/15 bg-card rounded-2xl border p-6 shadow-sm'>
      <div className='mb-5 space-y-2'>
        <Skeleton className='h-6 w-40' />
        <Skeleton className='h-4 w-full max-w-xs' />
      </div>
      <div className='space-y-5'>
        <div className='space-y-2'>
          <Skeleton className='h-4 w-24' />
          <div className='flex gap-1'>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className='h-7 w-7 rounded-md' />
            ))}
          </div>
        </div>
        <div className='space-y-2'>
          <Skeleton className='h-4 w-20' />
          <Skeleton className='h-24 w-full rounded-md' />
        </div>
        <Skeleton className='h-10 w-32 rounded-full' />
      </div>
    </div>
  );
}

function StoreReviewItemSkeleton() {
  return (
    <li className='border-gold/10 border-b pb-6 last:border-0'>
      <div className='flex items-start justify-between gap-3'>
        <Skeleton className='h-4 w-28' />
        <Skeleton className='h-3 w-16' />
      </div>
      <div className='mt-2 flex gap-1'>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className='h-3.5 w-3.5 rounded-sm' />
        ))}
      </div>
      <div className='mt-2 space-y-2'>
        <Skeleton className='h-3 w-full' />
        <Skeleton className='h-3 w-4/5' />
      </div>
    </li>
  );
}

/** Review rows only — for paginated load-more without shifting the summary block. */
export function StoreReviewItemsSkeleton({ itemCount = 2 }: { itemCount?: number }) {
  return (
    <ul className='w-full space-y-6'>
      {Array.from({ length: itemCount }).map((_, i) => (
        <StoreReviewItemSkeleton key={i} />
      ))}
    </ul>
  );
}

/** Matches rating breakdown + review list — avoids layout shift on initial fetch. */
export function StoreReviewListSkeleton({ itemCount = 3 }: { itemCount?: number }) {
  return (
    <div className='space-y-8'>
      <div className='border-gold/10 bg-card rounded-2xl border p-6'>
        <Skeleton className='h-12 w-16' />
        <div className='mt-2 flex gap-1'>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className='h-4 w-4 rounded-sm' />
          ))}
        </div>
        <Skeleton className='mt-2 h-4 w-36' />
        <div className='mt-6 space-y-2'>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className='flex items-center gap-2'>
              <Skeleton className='h-3 w-12' />
              <Skeleton className='h-1.5 flex-1 rounded-full' />
              <Skeleton className='h-3 w-8' />
            </div>
          ))}
        </div>
      </div>
      <ul className='space-y-6'>
        {Array.from({ length: itemCount }).map((_, i) => (
          <StoreReviewItemSkeleton key={i} />
        ))}
      </ul>
    </div>
  );
}
