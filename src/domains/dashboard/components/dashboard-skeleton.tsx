import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
  return (
    <div className='space-y-6'>
      <Skeleton className='h-24 w-full rounded-2xl' />
      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-5'>
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className='h-36 w-full rounded-2xl' />
        ))}
      </div>
      <div className='grid gap-4 lg:grid-cols-3'>
        <Skeleton className='h-96 w-full rounded-2xl lg:col-span-2' />
        <Skeleton className='h-96 w-full rounded-2xl' />
      </div>
      <Skeleton className='h-56 w-full rounded-2xl' />
      <Skeleton className='h-96 w-full rounded-2xl' />
    </div>
  );
}
