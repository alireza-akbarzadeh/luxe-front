import { Skeleton } from '@/components/ui/skeleton';
import {
  PRODUCT_CARD_HEIGHT_DEFAULT,
  PRODUCT_CARD_INFO_MIN_HEIGHT_DEFAULT,
  PRODUCT_CARD_INFO_TOP_RADIUS_DEFAULT
} from '@/domains/shop/lib/product-card-layout';
import { cn } from '@/lib/utils';

function ProductCardSkeleton() {
  return (
    <div
      className={cn(
        'border-border/50 bg-card relative w-full overflow-hidden rounded-2xl border shadow-sm',
        PRODUCT_CARD_HEIGHT_DEFAULT
      )}
    >
      <Skeleton className='absolute inset-0 rounded-none' />
      <Skeleton className='absolute end-2.5 top-2.5 z-10 size-9 rounded-full' />
      <div
        className={cn(
          'bg-card absolute inset-x-0 bottom-0 z-10 flex flex-col gap-1.5 p-4',
          PRODUCT_CARD_INFO_TOP_RADIUS_DEFAULT,
          PRODUCT_CARD_INFO_MIN_HEIGHT_DEFAULT
        )}
      >
        <Skeleton className='h-2.5 w-14' />
        <Skeleton className='h-5 w-4/5' />
        <Skeleton className='h-3 w-28' />
        <Skeleton className='h-4 w-16' />
        <div className='mt-auto flex gap-2 pt-2'>
          <Skeleton className='h-9 flex-1 rounded-lg' />
          <Skeleton className='h-9 flex-[1.2] rounded-lg' />
        </div>
      </div>
    </div>
  );
}

/** Catalog skeleton — 3-column vertical ProductCards. */
export function ProductsCatalogSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div
      className='grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-3 lg:gap-6'
      aria-busy='true'
      aria-hidden
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Full PLP skeleton matching hero + filters + 3-col cards. */
export function ProductsPageSkeleton() {
  return (
    <div className='pb-24' aria-busy='true' aria-hidden>
      <section className='from-secondary/50 via-background to-background relative border-b bg-linear-to-br'>
        <div className='app-container pt-8 pb-10 sm:pt-10 lg:pt-12 lg:pb-14'>
          <Skeleton className='mb-6 h-4 w-40' />
          <div className='grid items-stretch gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]'>
            <div className='space-y-4'>
              <Skeleton className='h-7 w-36 rounded-full' />
              <Skeleton className='h-12 w-72 max-w-full md:h-14' />
              <Skeleton className='h-4 max-w-xl' />
              <Skeleton className='h-4 max-w-md' />
              <div className='flex gap-3 pt-2'>
                <Skeleton className='h-8 w-28 rounded-full' />
                <Skeleton className='h-8 w-24 rounded-full' />
              </div>
            </div>
            <Skeleton className='aspect-16/11 w-full rounded-3xl' />
          </div>
        </div>
      </section>

      <div className='app-container pt-8'>
        <div className='border-border mb-6 space-y-5 border-b pb-6'>
          <Skeleton className='h-12 w-full rounded-full md:h-14' />
          <div className='flex justify-between gap-4'>
            <Skeleton className='h-5 w-28' />
            <Skeleton className='h-10 w-44 rounded-full' />
          </div>
        </div>

        <div className='mt-6 flex gap-10 xl:gap-12'>
          <aside className='hidden w-72 shrink-0 lg:block'>
            <div className='bg-card/90 rounded-3xl border p-5'>
              <Skeleton className='mb-4 h-6 w-20' />
              <div className='space-y-5'>
                <Skeleton className='h-10 w-full rounded-xl' />
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className='space-y-3'>
                    <Skeleton className='h-4 w-24' />
                    <Skeleton className='h-8 w-full rounded-full' />
                  </div>
                ))}
              </div>
            </div>
          </aside>
          <div className='min-w-0 flex-1'>
            <ProductsCatalogSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}
