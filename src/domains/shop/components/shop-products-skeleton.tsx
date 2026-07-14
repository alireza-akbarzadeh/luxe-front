import { Skeleton } from '@/components/ui/skeleton';
import {
  PRODUCT_CARD_HEIGHT_DEFAULT,
  PRODUCT_CARD_INFO_MIN_HEIGHT_DEFAULT,
  PRODUCT_CARD_INFO_TOP_RADIUS_DEFAULT
} from '@/domains/shop/lib/product-card-layout';
import { cn } from '@/lib/utils';

interface ShopProductsSkeletonProps {
  variant?: 'grid' | 'list';
}

export function ShopProductsSkeleton({ variant = 'grid' }: ShopProductsSkeletonProps) {
  if (variant === 'list') {
    return (
      <div className='flex flex-col gap-4'>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className='bg-card flex gap-4 rounded-xl border p-4'>
            <Skeleton className='h-32 w-32 shrink-0 rounded-lg' />
            <div className='flex min-w-0 flex-1 flex-col justify-center gap-3'>
              <Skeleton className='h-3 w-16' />
              <Skeleton className='h-5 w-2/3 max-w-xs' />
              <Skeleton className='h-4 w-40' />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4'>
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'border-border/50 bg-card relative w-full overflow-hidden rounded-2xl border shadow-sm',
            PRODUCT_CARD_HEIGHT_DEFAULT
          )}
        >
          <Skeleton className='absolute inset-0 rounded-none' />
          <div
            className={cn(
              'bg-card absolute inset-x-0 bottom-0 z-10 flex flex-col gap-1.5 p-4',
              PRODUCT_CARD_INFO_TOP_RADIUS_DEFAULT,
              PRODUCT_CARD_INFO_MIN_HEIGHT_DEFAULT
            )}
          >
            <Skeleton className='h-2.5 w-14' />
            <Skeleton className='h-5 w-4/5' />
            <Skeleton className='h-4 w-16' />
            <div className='mt-auto flex gap-2 pt-2'>
              <Skeleton className='h-9 flex-1 rounded-lg' />
              <Skeleton className='h-9 flex-[1.2] rounded-lg' />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
