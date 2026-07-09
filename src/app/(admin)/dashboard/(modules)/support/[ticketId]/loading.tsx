import { Skeleton } from '@/components/ui/skeleton';

export default function SupportDetailLoading() {
  return (
    <div className='space-y-6'>
      <Skeleton className='h-8 w-32' />
      <Skeleton className='h-10 w-full max-w-2xl' />
      <div className='grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]'>
        <Skeleton className='h-96 rounded-2xl' />
        <Skeleton className='h-64 rounded-2xl' />
      </div>
    </div>
  );
}
