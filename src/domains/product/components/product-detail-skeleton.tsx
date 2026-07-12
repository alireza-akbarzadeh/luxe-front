import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

import {
  PDP_MOBILE_GALLERY_IMAGE_CLASS,
  PDP_MOBILE_INFO_OVERLAP_CLASS,
  PDP_MOBILE_PAGE_PADDING_CLASS,
  PDP_MOBILE_SHEET_RADIUS_CLASS,
  PDP_MOBILE_SHEET_SHADOW_CLASS,
  PDP_MOBILE_TAB_BAR_OFFSET
} from '../lib/product-detail-mobile';

const mobileSheetClassName = cn(
  'bg-background border-border/80 border-t',
  PDP_MOBILE_SHEET_RADIUS_CLASS,
  PDP_MOBILE_SHEET_SHADOW_CLASS
);

export function ProductDetailSkeleton() {
  return (
    <>
      <div className={cn('lg:hidden', PDP_MOBILE_PAGE_PADDING_CLASS)}>
        <Skeleton className={cn(PDP_MOBILE_GALLERY_IMAGE_CLASS, 'rounded-none')} />

        <div
          className={cn(
            mobileSheetClassName,
            PDP_MOBILE_INFO_OVERLAP_CLASS,
            'relative z-10 px-4 pt-7 pb-6'
          )}
        >
          <Skeleton className='h-3 w-28' />
          <Skeleton className='mt-5 h-9 w-4/5' />
          <Skeleton className='mt-4 h-5 w-36' />
          <Skeleton className='mt-4 h-10 w-32' />
          <Skeleton className='mt-5 h-20 w-full' />
        </div>

        <div
          className={cn(
            'bg-background/95 fixed inset-x-0 z-[45] px-4 pt-3 pb-4 backdrop-blur-xl',
            mobileSheetClassName
          )}
          style={{ bottom: PDP_MOBILE_TAB_BAR_OFFSET }}
        >
          <Skeleton className='mx-auto h-1 w-10 rounded-full' />
          <Skeleton className='mt-4 h-5 w-24' />
          <Skeleton className='mt-2 h-8 w-28' />
          <Skeleton className='mt-4 h-14 w-full rounded-2xl' />
        </div>
      </div>

      <div className='app-container mt-20 hidden animate-pulse pb-16 lg:block'>
        <Skeleton className='mb-8 h-4 w-48' />

        <div className='grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-12 xl:gap-16'>
          <div className='space-y-4'>
            <Skeleton className='aspect-[4/3] max-h-[min(480px,50vh)] w-full rounded-2xl' />
            <Skeleton className='h-2 w-full rounded-full' />
            <div className='flex gap-2'>
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className='h-16 w-16 rounded-xl' />
              ))}
            </div>
          </div>

          <div className='border-border/60 space-y-6 rounded-2xl border p-6 sm:p-8'>
            <Skeleton className='h-4 w-24' />
            <Skeleton className='h-10 w-full max-w-md' />
            <Skeleton className='h-5 w-32' />
            <Skeleton className='h-8 w-40' />
            <Skeleton className='h-20 w-full' />
            <Skeleton className='h-11 w-full rounded-full' />
            <Skeleton className='h-11 w-full rounded-full' />
          </div>
        </div>
      </div>
    </>
  );
}
