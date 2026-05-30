import { Skeleton } from '@/components/ui/skeleton';

export function AccountPageSkeleton() {
  return (
    <div className='pt-24 pb-16'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-8 space-y-2'>
          <Skeleton className='h-9 w-48' />
          <Skeleton className='h-5 w-full max-w-md' />
        </div>

        <div className='hidden gap-8 lg:grid lg:grid-cols-[250px_1fr]'>
          <aside className='space-y-2'>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className='h-12 w-full rounded-xl' />
            ))}
            <Skeleton className='my-4 h-px w-full' />
            <Skeleton className='h-12 w-full rounded-xl' />
          </aside>

          <div className='space-y-6'>
            <Skeleton className='h-32 w-full rounded-2xl' />
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className='h-28 w-full rounded-2xl' />
              ))}
            </div>
            <Skeleton className='h-64 w-full rounded-2xl' />
          </div>
        </div>

        <div className='space-y-4 lg:hidden'>
          <Skeleton className='h-11 w-full rounded-xl' />
          <Skeleton className='h-48 w-full rounded-2xl' />
          <Skeleton className='h-64 w-full rounded-2xl' />
        </div>
      </div>
    </div>
  );
}
