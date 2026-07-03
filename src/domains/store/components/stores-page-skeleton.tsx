import { Skeleton } from '@/components/ui/skeleton';
import { StoresGridSkeleton } from '@/domains/store/components/store-cart-skeleton';

export function StoresPageSkeleton() {
  return (
    <main className='pb-20'>
      <section className='border-border relative isolate overflow-hidden border-b'>
        <div className='app-container flex flex-col items-center py-20 text-center lg:py-28'>
          <Skeleton className='mb-4 h-7 w-40 rounded-full' />
          <Skeleton className='mb-3 h-12 w-full max-w-2xl' />
          <Skeleton className='mb-8 h-5 w-full max-w-xl' />
          <Skeleton className='h-12 w-full max-w-xl rounded-2xl' />
          <div className='mt-8 flex flex-wrap justify-center gap-2'>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className='h-8 w-24 rounded-full' />
            ))}
          </div>
        </div>
      </section>

      <div className='app-container'>
        <div className='grid gap-8 py-8 lg:grid-cols-[280px_1fr]'>
          <aside className='hidden space-y-4 lg:block'>
            <Skeleton className='h-6 w-24' />
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className='h-24 w-full rounded-2xl' />
            ))}
          </aside>

          <div className='min-w-0 space-y-8'>
            <Skeleton className='h-48 w-full rounded-2xl' />

            <div className='border-border flex flex-wrap items-center justify-between gap-3 border-b py-3'>
              <Skeleton className='h-5 w-32' />
              <div className='flex gap-2'>
                <Skeleton className='h-9 w-28' />
                <Skeleton className='h-9 w-20' />
              </div>
            </div>

            <StoresGridSkeleton />
          </div>
        </div>
      </div>
    </main>
  );
}
