import { Skeleton } from '@/components/ui/skeleton';

export default function VendorApplyLoading() {
  return (
    <div className='mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-14'>
      <div className='mb-8 space-y-3 text-center'>
        <Skeleton className='mx-auto h-10 w-72 max-w-full' />
        <Skeleton className='mx-auto h-5 w-96 max-w-full' />
      </div>
      <Skeleton className='mb-8 h-14 w-full rounded-xl' />
      <Skeleton className='h-[420px] w-full rounded-2xl' />
      <div className='mt-8 flex justify-between'>
        <Skeleton className='h-10 w-24' />
        <Skeleton className='h-10 w-32 rounded-full' />
      </div>
    </div>
  );
}
