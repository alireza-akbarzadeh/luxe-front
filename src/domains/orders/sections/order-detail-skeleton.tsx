import { Skeleton } from '@/components/ui/skeleton';

export function OrderDetailSkeleton() {
  return (
    <div className='space-y-6'>
      <div className='flex items-start gap-4'>
        <Skeleton className='size-9 rounded-xl' />
        <div className='space-y-2'>
          <Skeleton className='h-7 w-48' />
          <Skeleton className='h-4 w-72' />
        </div>
      </div>
      <Skeleton className='h-36 w-full rounded-2xl' />
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        <div className='space-y-6 lg:col-span-2'>
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className='h-24 rounded-2xl' />
            ))}
          </div>
          <Skeleton className='h-64 w-full rounded-2xl' />
          <Skeleton className='h-48 w-full rounded-2xl' />
        </div>
        <div className='space-y-5'>
          <Skeleton className='h-56 w-full rounded-2xl' />
          <Skeleton className='h-44 w-full rounded-2xl' />
          <Skeleton className='h-40 w-full rounded-2xl' />
        </div>
      </div>
    </div>
  );
}
