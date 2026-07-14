'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function NotificationsSkeleton() {
  return (
    <div className='space-y-8'>
      <div className='space-y-3'>
        <Skeleton className='h-10 w-64' />
        <Skeleton className='h-4 w-96 max-w-full' />
      </div>

      <Skeleton className='h-12 w-full max-w-4xl' />

      <div className='grid gap-8 lg:grid-cols-[260px_1fr]'>
        <div className='hidden space-y-3 lg:block'>
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className='h-10 w-full rounded-xl' />
          ))}
          <Skeleton className='h-40 w-full rounded-2xl' />
        </div>

        <div className='space-y-3'>
          <Skeleton className='h-8 w-48' />
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className='h-28 w-full rounded-2xl' />
          ))}
        </div>
      </div>
    </div>
  );
}
