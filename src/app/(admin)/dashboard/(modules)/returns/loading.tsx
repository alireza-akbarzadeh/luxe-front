import { Skeleton } from '@/components/ui/skeleton';

export default function ReturnsLoading() {
  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <Skeleton className='h-8 w-36' />
        <Skeleton className='h-4 w-96 max-w-full' />
      </div>
      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className='h-28 rounded-2xl' />
        ))}
      </div>
      <Skeleton className='h-[480px] w-full rounded-xl' />
    </div>
  );
}
