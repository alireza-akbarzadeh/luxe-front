import { Skeleton } from '@/components/ui/skeleton';

export function ShipmentDetailSkeleton() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-4'>
        <Skeleton className='h-9 w-9 rounded-xl' />
        <div className='space-y-2'>
          <Skeleton className='h-7 w-48' />
          <Skeleton className='h-4 w-72' />
        </div>
      </div>
      <Skeleton className='h-40 w-full rounded-2xl' />
      <div className='grid gap-6 lg:grid-cols-3'>
        <Skeleton className='h-64 rounded-2xl lg:col-span-2' />
        <Skeleton className='h-64 rounded-2xl' />
      </div>
    </div>
  );
}
