import dynamic from 'next/dynamic';

import { Skeleton } from '@/components/ui/skeleton';

const LiveSaleFeedDomain = dynamic(
  () => import('@/domains/sales-feed/salese-feed').then((mod) => mod.LiveSaleFeedDomain),
  {
    loading: () => <LiveFeedPageSkeleton />
  }
);

function LiveFeedPageSkeleton() {
  return (
    <div className='bg-background space-y-8 p-6'>
      <div className='flex items-center justify-between'>
        <Skeleton className='h-10 w-64' />
        <Skeleton className='h-9 w-24 rounded-xl' />
      </div>
      <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className='h-28 rounded-2xl' />
        ))}
      </div>
      <div className='grid grid-cols-1 gap-6 xl:grid-cols-3'>
        <Skeleton className='h-64 rounded-2xl xl:col-span-2' />
        <Skeleton className='h-64 rounded-2xl' />
      </div>
      <Skeleton className='h-96 rounded-2xl' />
    </div>
  );
}

export default function LivePage() {
  return <LiveSaleFeedDomain />;
}
