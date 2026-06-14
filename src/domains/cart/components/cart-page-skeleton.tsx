import { Skeleton } from '@/components/ui/skeleton';

export function CartPageSkeleton() {
  return (
    <main className='pt-24 pb-16'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <Skeleton className='mb-8 h-4 w-48' />
        <Skeleton className='mb-8 h-10 w-64' />

        <div className='grid gap-8 lg:grid-cols-3 lg:gap-12'>
          <div className='space-y-4 lg:col-span-2'>
            {[1, 2].map((i) => (
              <div key={i} className='flex gap-4 rounded-2xl border p-4'>
                <Skeleton className='h-28 w-28 shrink-0 rounded-xl sm:h-32 sm:w-32' />
                <div className='flex flex-1 flex-col gap-3'>
                  <Skeleton className='h-5 w-3/4' />
                  <Skeleton className='h-4 w-1/3' />
                  <div className='mt-auto flex justify-between'>
                    <Skeleton className='h-8 w-28 rounded-full' />
                    <Skeleton className='h-6 w-16' />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Skeleton className='h-80 rounded-2xl lg:col-span-1' />
        </div>
      </div>
    </main>
  );
}
