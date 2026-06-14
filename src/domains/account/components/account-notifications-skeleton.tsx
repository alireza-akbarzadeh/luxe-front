import { Skeleton } from '@/components/ui/skeleton';

export function AccountNotificationsSkeleton() {
  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <Skeleton className='h-8 w-44' />
        <Skeleton className='h-9 w-32 rounded-full' />
      </div>
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className='h-24 w-full rounded-xl' />
      ))}
    </div>
  );
}
