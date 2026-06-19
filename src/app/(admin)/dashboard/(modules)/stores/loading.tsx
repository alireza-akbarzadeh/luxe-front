import { Skeleton } from '@/components/ui/skeleton';

export default function StoresLoading() {
  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <Skeleton className='h-8 w-32' />
        <Skeleton className='h-4 w-96 max-w-full' />
      </div>
      <Skeleton className='h-[520px] w-full rounded-xl' />
    </div>
  );
}
