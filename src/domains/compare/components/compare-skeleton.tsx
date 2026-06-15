import { Skeleton } from '@/components/ui/skeleton';

export function CompareSkeleton() {
  return (
    <div className='mt-8 space-y-6'>
      <div className='space-y-3'>
        <Skeleton className='h-4 w-32' />
        <Skeleton className='h-10 w-72 max-w-full' />
        <Skeleton className='h-4 w-96 max-w-full' />
      </div>

      <div className='flex gap-2'>
        {[...Array(4)].map((_, index) => (
          <Skeleton key={index} className='h-2.5 w-10 rounded-full' />
        ))}
      </div>

      <div className='grid gap-4 md:grid-cols-3'>
        {[...Array(3)].map((_, index) => (
          <Skeleton key={index} className='h-80 rounded-2xl' />
        ))}
      </div>
    </div>
  );
}
