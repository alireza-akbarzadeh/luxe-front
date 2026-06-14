import { Skeleton } from '@/components/ui/skeleton';

export function AccountWishlistSkeleton() {
  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
        <div className='space-y-2'>
          <Skeleton className='h-8 w-40' />
          <Skeleton className='h-4 w-56' />
        </div>
        <Skeleton className='h-10 w-44 rounded-full' />
      </div>
      <div className='grid grid-cols-2 gap-4 md:grid-cols-3'>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className='bg-card border-border rounded-2xl border p-3 sm:p-4'>
            <Skeleton className='mb-3 aspect-square w-full rounded-xl' />
            <Skeleton className='mb-2 h-4 w-4/5' />
            <Skeleton className='h-5 w-1/3' />
            <Skeleton className='mt-3 h-9 w-full rounded-full' />
          </div>
        ))}
      </div>
    </div>
  );
}
