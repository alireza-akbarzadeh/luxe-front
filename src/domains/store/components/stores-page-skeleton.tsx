import { Skeleton } from '@/components/ui/skeleton';
import { StoresGridSkeleton } from '@/domains/store/components/store-cart-skeleton';

export function StoresPageSkeleton() {
  return (
    <div className='space-y-10'>
      <Skeleton className='h-[420px] w-full rounded-none' />
      <div className='mx-auto max-w-screen-2xl px-4 lg:px-8'>
        <div className='grid gap-8 lg:grid-cols-[280px_1fr]'>
          <Skeleton className='hidden h-[600px] rounded-2xl lg:block' />
          <StoresGridSkeleton />
        </div>
      </div>
    </div>
  );
}
