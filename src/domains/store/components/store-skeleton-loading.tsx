import { Skeleton } from '@/components/ui/skeleton';

export function StoreSkeleton() {
  return (
    <>
      {/* Header skeleton */}
      <section className='relative pt-20'>
        <div className='bg-muted relative h-48 animate-pulse md:h-64' />
        <div className='relative mx-auto -mt-16 max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col items-start gap-4 md:flex-row md:items-end md:gap-6'>
            <Skeleton className='h-24 w-24 rounded-2xl md:h-32 md:w-32' />
            <div className='flex-1 space-y-2'>
              <Skeleton className='h-8 w-48' />
              <Skeleton className='h-4 w-96' />
              <div className='mt-3 flex gap-4'>
                <Skeleton className='h-4 w-20' />
                <Skeleton className='h-4 w-20' />
                <Skeleton className='h-4 w-20' />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products section skeleton */}
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
            <aside className='hidden w-64 shrink-0 lg:block'>
              <div className='space-y-6'>
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className='h-32 w-full' />
                ))}
              </div>
            </aside>
            <div className='flex-1'>
              <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4'>
                {Array(8)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className='space-y-2'>
                      <Skeleton className='aspect-4/5 w-full rounded-2xl' />
                      <Skeleton className='h-4 w-3/4' />
                      <Skeleton className='h-4 w-1/2' />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
