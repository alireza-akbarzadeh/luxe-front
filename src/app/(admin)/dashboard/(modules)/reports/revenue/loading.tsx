import { Skeleton } from '@/components/ui/skeleton';

export default function RevenueReportLoading() {
  return (
    <div className='space-y-6'>
      <Skeleton className='h-20 w-full rounded-2xl' />
      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className='h-36 w-full rounded-2xl' />
        ))}
      </div>
      <Skeleton className='h-96 w-full rounded-2xl' />
      <Skeleton className='h-96 w-full rounded-2xl' />
    </div>
  );
}
