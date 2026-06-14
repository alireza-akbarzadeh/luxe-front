import { Skeleton } from '@/components/ui/skeleton';

export function OrderHistorySkeleton() {
  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <Skeleton className='h-8 w-40' />
        <Skeleton className='h-9 w-28 rounded-full' />
      </div>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className='bg-card border-border rounded-2xl border p-5 sm:p-6'>
          <div className='mb-4 flex flex-wrap items-start justify-between gap-3'>
            <div className='space-y-2'>
              <Skeleton className='h-5 w-36' />
              <Skeleton className='h-4 w-28' />
            </div>
            <Skeleton className='h-7 w-24 rounded-full' />
          </div>
          <div className='flex gap-2'>
            {Array.from({ length: 3 }).map((__, thumbIndex) => (
              <Skeleton key={thumbIndex} className='size-14 rounded-xl' />
            ))}
          </div>
          <div className='border-border mt-4 flex items-center justify-between border-t pt-4'>
            <Skeleton className='h-4 w-24' />
            <Skeleton className='h-6 w-20' />
          </div>
        </div>
      ))}
    </div>
  );
}
