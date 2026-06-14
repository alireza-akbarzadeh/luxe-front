import { Skeleton } from '@/components/ui/skeleton';

export function AccountWalletSkeleton() {
  return (
    <div className='space-y-6'>
      <Skeleton className='h-44 w-full rounded-2xl' />
      <div className='grid gap-4 sm:grid-cols-3'>
        <Skeleton className='h-24 rounded-xl' />
        <Skeleton className='h-24 rounded-xl' />
        <Skeleton className='h-24 rounded-xl' />
      </div>
      <Skeleton className='h-72 w-full rounded-2xl' />
      <div className='space-y-3'>
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className='h-20 w-full rounded-xl' />
        ))}
      </div>
    </div>
  );
}
