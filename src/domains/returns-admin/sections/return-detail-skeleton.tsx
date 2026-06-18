import { Skeleton } from '@/components/ui/skeleton';

export function ReturnDetailSkeleton() {
  return (
    <div className='space-y-6'>
      <div className='flex items-start gap-4'>
        <Skeleton className='size-9 rounded-xl' />
        <div className='space-y-2'>
          <Skeleton className='h-7 w-40' />
          <Skeleton className='h-4 w-64' />
        </div>
      </div>
      <Skeleton className='h-36 w-full rounded-2xl' />
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        <div className='space-y-6 lg:col-span-2'>
          <Skeleton className='h-32 w-full rounded-2xl' />
          <Skeleton className='h-48 w-full rounded-2xl' />
        </div>
        <div className='space-y-5'>
          <Skeleton className='h-28 w-full rounded-2xl' />
          <Skeleton className='h-36 w-full rounded-2xl' />
        </div>
      </div>
    </div>
  );
}
