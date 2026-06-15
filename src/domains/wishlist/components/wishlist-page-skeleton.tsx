import { Skeleton } from '@/components/ui/skeleton';

export function WishlistPageSkeleton() {
  return (
    <main className='app-container pt-24 pb-16'>
      <Skeleton className='mb-6 h-4 w-32' />
      <Skeleton className='mb-2 h-10 w-64' />
      <Skeleton className='mb-8 h-5 w-48' />
      <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4'>
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className='space-y-3'>
            <Skeleton className='aspect-square w-full rounded-2xl' />
            <Skeleton className='h-4 w-3/4' />
            <Skeleton className='h-5 w-1/3' />
            <Skeleton className='h-9 w-full rounded-full' />
          </div>
        ))}
      </div>
    </main>
  );
}
