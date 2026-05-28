import { Skeleton } from '@/components/ui/skeleton';

export function StoreHeaderSkeleton() {
  return (
    <section className='relative pt-20'>
      <Skeleton className='h-48 w-full md:h-64' />
      <div className='relative mx-auto -mt-16 max-w-7xl px-4 sm:px-6 lg:px-8'>
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
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
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
