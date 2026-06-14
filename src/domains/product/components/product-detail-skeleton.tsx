import { Skeleton } from '@/components/ui/skeleton';

export function ProductDetailSkeleton() {
  return (
    <div className='app-container mt-20 animate-pulse pb-16'>
      <Skeleton className='mb-8 h-4 w-48' />

      <div className='grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-12 xl:gap-16'>
        <div className='space-y-4'>
          <Skeleton className='aspect-4/5 w-full rounded-2xl' />
          <Skeleton className='h-2 w-full rounded-full' />
          <div className='flex gap-2'>
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className='h-16 w-16 rounded-xl' />
            ))}
          </div>
        </div>

        <div className='border-border/60 space-y-6 rounded-2xl border p-6 sm:p-8'>
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-10 w-full max-w-md' />
          <Skeleton className='h-5 w-32' />
          <Skeleton className='h-8 w-40' />
          <Skeleton className='h-20 w-full' />
          <Skeleton className='h-11 w-full rounded-full' />
          <Skeleton className='h-11 w-full rounded-full' />
        </div>
      </div>
    </div>
  );
}
