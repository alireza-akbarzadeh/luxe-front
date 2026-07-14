import { Skeleton } from '@/components/ui/skeleton';
import {
  PRODUCT_CARD_HEIGHT_DEFAULT,
  PRODUCT_CARD_INFO_MIN_HEIGHT_DEFAULT,
  PRODUCT_CARD_INFO_TOP_RADIUS_DEFAULT
} from '@/domains/shop/lib/product-card-layout';
import { cn } from '@/lib/utils';

type CatalogView = 'list' | 'grid';

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
          'bg-card absolute inset-x-0 bottom-0 z-10 flex flex-col gap-1.5 p-4 shadow-[0_-10px_28px_-6px_rgba(0,0,0,0.45)]',
          PRODUCT_CARD_INFO_TOP_RADIUS_DEFAULT,
          PRODUCT_CARD_INFO_MIN_HEIGHT_DEFAULT
        )}
      >
        <Skeleton className='h-2.5 w-14' />
        <Skeleton className='h-5 w-4/5' />
        <Skeleton className='h-3 w-28' />
        <div className='flex items-center gap-1.5'>
          <Skeleton className='size-3.5 rounded-full' />
          <Skeleton className='size-3.5 rounded-full' />
          <Skeleton className='size-3.5 rounded-full' />
        </div>
        <Skeleton className='h-4 w-16' />
        <div className='mt-auto flex gap-2 pt-2'>
          <Skeleton className='h-9 flex-1 rounded-lg' />
          <Skeleton className='h-9 flex-[1.2] rounded-lg' />
        </div>
      </div>
    </div>
  );
}

function ProductListRowSkeleton() {
  return (
    <div className='bg-card flex gap-4 rounded-xl border p-4'>
      <Skeleton className='h-32 w-32 shrink-0 rounded-lg' />
      <div className='flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-center'>
        <div className='min-w-0 flex-1 space-y-2'>
          <Skeleton className='h-3 w-16' />
          <Skeleton className='h-5 w-[60%] max-w-xs' />
          <Skeleton className='h-4 w-[80%] max-w-md' />
          <div className='flex flex-wrap items-center gap-x-4 gap-y-1 pt-0.5'>
            <Skeleton className='h-4 w-16' />
            <Skeleton className='h-4 w-20' />
          </div>
        </div>
        <div className='flex shrink-0 items-center gap-2 sm:flex-col sm:justify-center'>
          <Skeleton className='size-10 rounded-md' />
          <Skeleton className='size-10 rounded-md' />
        </div>
      </div>
    </div>
  );
}

function FiltersSidebarSkeleton() {
  return (
    <div className='bg-card rounded-2xl border p-6 shadow-sm'>
      <Skeleton className='mb-4 h-6 w-20' />
      <div className='space-y-8'>
        <div className='space-y-3'>
          <Skeleton className='h-4 w-24' />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className='flex items-center gap-2'>
              <Skeleton className='size-4 rounded-full' />
              <Skeleton className='h-4 w-28' />
            </div>
          ))}
        </div>
        <div className='space-y-3'>
          <Skeleton className='h-4 w-20' />
          <Skeleton className='h-2 w-full rounded-full' />
          <div className='flex justify-between'>
            <Skeleton className='h-3 w-10' />
            <Skeleton className='h-3 w-10' />
          </div>
        </div>
        <div className='space-y-3'>
          <Skeleton className='h-4 w-16' />
          <Skeleton className='h-2 w-full rounded-full' />
        </div>
        <div className='space-y-3'>
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-9 w-full' />
          <Skeleton className='h-9 w-full' />
        </div>
        <div className='space-y-3'>
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-5 w-full' />
          <Skeleton className='h-5 w-full' />
          <Skeleton className='h-5 w-full' />
        </div>
      </div>
    </div>
  );
}

function ToolbarSkeleton() {
  return (
    <div className='border-border mb-8 space-y-5 border-b pb-8'>
      <Skeleton className='h-12 w-full rounded-full md:h-14' />
      <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
        <Skeleton className='h-5 w-28' />
        <div className='flex w-full items-center justify-end gap-3 sm:w-auto'>
          <Skeleton className='h-10 w-full rounded-full sm:w-44' />
          <Skeleton className='hidden h-10 w-20 rounded-full md:block' />
        </div>
      </div>
    </div>
  );
}

function HeroSkeleton() {
  return (
    <section className='from-secondary/40 via-background to-background relative border-b bg-linear-to-b'>
      <div className='app-container relative pt-10 pb-10 sm:pt-12 md:pb-12 lg:pt-14 lg:pb-14'>
        <Skeleton className='mb-4 h-7 w-40 rounded-full' />
        <Skeleton className='h-12 w-72 max-w-full rounded-lg md:h-14' />
        <Skeleton className='mt-4 h-4 max-w-2xl' />
        <Skeleton className='mt-2 h-4 max-w-xl' />
        <div className='mt-6 flex flex-wrap gap-3'>
          <Skeleton className='h-8 w-32 rounded-full' />
          <Skeleton className='h-8 w-28 rounded-full' />
        </div>
      </div>
    </section>
  );
}

interface ProductsCatalogSkeletonProps {
  view?: CatalogView;
  count?: number;
}

/** Catalog-only skeleton (hero/toolbar already on screen). */
export function ProductsCatalogSkeleton({
  view = 'grid',
  count = view === 'list' ? 6 : 8
}: ProductsCatalogSkeletonProps) {
  if (view === 'list') {
    return (
      <div className='flex flex-col gap-4' aria-busy='true' aria-hidden>
        {Array.from({ length: count }).map((_, index) => (
          <ProductListRowSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div
      className='grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4'
      aria-busy='true'
      aria-hidden
    >
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

interface ProductsPageSkeletonProps {
  view?: CatalogView;
}

/** Full route skeleton — matches products PLP hero, toolbar, filters, and catalog. */
export function ProductsPageSkeleton({ view = 'grid' }: ProductsPageSkeletonProps) {
  return (
    <div className='pb-20' aria-busy='true' aria-hidden>
      <HeroSkeleton />

      <div className='app-container pt-8'>
        <ToolbarSkeleton />

        <div className='mt-8 flex gap-12'>
          <aside className='hidden w-64 shrink-0 lg:block'>
            <div className='sticky top-28'>
              <FiltersSidebarSkeleton />
            </div>
          </aside>

          <div className='min-w-0 flex-1'>
            <ProductsCatalogSkeleton view={view} />
          </div>
        </div>
      </div>
    </div>
  );
}
