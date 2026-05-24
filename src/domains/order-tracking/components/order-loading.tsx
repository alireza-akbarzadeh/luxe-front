import { Skeleton } from '~/src/components/ui/skeleton';

export function OrderTrackingSkeleton() {
  return (
    <div className='pt-24 pb-16'>
      <div className='mx-auto max-w-4xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-8 flex justify-center'>
          <Skeleton className='h-24 w-24 rounded-full' />
        </div>
        <div className='mb-12 text-center'>
          <Skeleton className='mx-auto mb-4 h-10 w-64' />
          <Skeleton className='mx-auto h-6 w-96' />
        </div>
        <div className='mb-12'>
          <Skeleton className='h-32 w-full rounded-2xl' />
        </div>
        <div className='mb-12'>
          <Skeleton className='mx-auto mb-6 h-6 w-40' />
          <div className='grid grid-cols-4 gap-2'>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className='flex flex-col items-center'>
                <Skeleton className='mb-3 h-12 w-12 rounded-full' />
                <Skeleton className='h-4 w-16' />
              </div>
            ))}
          </div>
        </div>
        <div className='mb-12 grid gap-6 lg:grid-cols-2'>
          <Skeleton className='h-64 rounded-2xl' />
          <Skeleton className='h-64 rounded-2xl' />
        </div>
      </div>
    </div>
  );
}
