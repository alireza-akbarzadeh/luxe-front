import { Skeleton } from '@/components/ui/skeleton';

export default function VendorPanelLoading() {
  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <Skeleton className='h-8 w-48' />
        <Skeleton className='h-4 w-72' />
      </div>
      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className='h-32 rounded-xl' />
        ))}
      </div>
      <Skeleton className='h-48 max-w-3xl rounded-xl' />
    </div>
  );
}
