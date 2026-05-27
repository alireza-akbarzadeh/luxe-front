import { Skeleton } from '@/components/ui/skeleton';
export function StoreCardSkeleton() {
  return (
    <div className='border-border bg-card overflow-hidden rounded-2xl border'>
      <Skeleton className='aspect-[16/9] w-full' />
      <div className='space-y-3 p-4'>
        <div className='flex items-center gap-3'>
          <Skeleton className='h-10 w-10 rounded-full' />
          <div className='flex-1 space-y-2'>
            <Skeleton className='h-4 w-2/3' />
            <Skeleton className='h-3 w-1/3' />
          </div>
        </div>
        <Skeleton className='h-3 w-full' />
        <Skeleton className='h-3 w-4/5' />
        <div className='flex gap-2'>
          <Skeleton className='h-5 w-14 rounded-full' />
          <Skeleton className='h-5 w-20 rounded-full' />
        </div>
      </div>
    </div>
  );
}
export function StoresGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {Array.from({ length: count }).map((_, i) => (
        <StoreCardSkeleton key={i} />
      ))}
    </div>
  );
}
