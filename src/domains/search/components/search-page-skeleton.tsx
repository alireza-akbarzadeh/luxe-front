import { Skeleton } from '@/components/ui/skeleton';
import { ProductGridSkeleton } from '@/domains/home/components/product-grid-skeleton';

interface SearchPageSkeletonProps {
  productCount?: number;
}

export function SearchPageSkeleton({ productCount = 12 }: SearchPageSkeletonProps) {
  return (
    <>
      <section className='from-secondary/50 to-background relative border-b bg-linear-to-b pt-20'>
        <div className='app-container max-w-5xl py-12 md:py-16'>
          <div className='mb-8 space-y-3 text-center'>
            <Skeleton className='mx-auto h-10 w-full max-w-md md:h-12' />
            <Skeleton className='mx-auto h-5 w-full max-w-sm' />
          </div>
          <Skeleton className='mx-auto h-14 w-full max-w-2xl rounded-2xl' />
          <div className='mt-12 flex flex-wrap justify-center gap-2'>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className='h-8 w-24 rounded-full' />
            ))}
          </div>
        </div>
      </section>

      <section className='py-8'>
        <div className='flex flex-col gap-8 lg:flex-row'>
          <aside className='hidden w-64 shrink-0 lg:block'>
            <div className='bg-card sticky top-24 rounded-2xl border p-6'>
              <Skeleton className='mb-4 h-5 w-24' />
              <div className='space-y-6'>
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-20' />
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className='h-5 w-full' />
                  ))}
                </div>
                <Skeleton className='h-px w-full' />
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-16' />
                  <Skeleton className='h-2 w-full' />
                  <div className='flex justify-between'>
                    <Skeleton className='h-4 w-10' />
                    <Skeleton className='h-4 w-10' />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div className='min-w-0 flex-1 space-y-6'>
            <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
              <div className='space-y-2'>
                <Skeleton className='h-6 w-48' />
                <Skeleton className='h-4 w-32' />
              </div>
              <div className='flex gap-2'>
                <Skeleton className='h-9 w-44' />
                <Skeleton className='hidden h-9 w-20 sm:block' />
              </div>
            </div>
            <ProductGridSkeleton count={productCount} columns={4} />
          </div>
        </div>
      </section>
    </>
  );
}
