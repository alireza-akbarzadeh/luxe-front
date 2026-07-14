'use client';

import { IconCheck, IconLoader2 } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { Skeleton } from '@/components/ui/skeleton';
import {
  PRODUCT_CARD_HEIGHT_DEFAULT,
  PRODUCT_CARD_INFO_MIN_HEIGHT_DEFAULT,
  PRODUCT_CARD_INFO_TOP_RADIUS_DEFAULT
} from '@/domains/shop/lib/product-card-layout';
import { useLocaleFormatters } from '@/lib/i18n/use-locale-formatters';
import { cn } from '@/lib/utils';

export function ProductsLoadMoreSkeleton() {
  return (
    <div className='mt-8 grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-3 lg:gap-6'>
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
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

interface ProductsEndStateProps {
  loadedCount: number;
}

export function ProductsEndState({ loadedCount }: ProductsEndStateProps) {
  const t = useTranslations('products.grid');
  const { formatInteger } = useLocaleFormatters();

  return (
    <div className='border-border/60 bg-muted/20 mt-10 flex flex-col items-center gap-2 rounded-3xl border px-6 py-10 text-center'>
      <IconCheck className='text-accent h-8 w-8' />
      <p className='font-medium'>{t('endTitle')}</p>
      <p className='text-muted-foreground text-sm'>
        {t('endDescription', { count: formatInteger(loadedCount) })}
      </p>
    </div>
  );
}

export function ProductsFetchingMore() {
  const t = useTranslations('products.grid');

  return (
    <div className='text-muted-foreground mt-8 flex items-center justify-center gap-2 text-sm'>
      <IconLoader2 className='h-4 w-4 animate-spin' />
      {t('loadingMore')}
    </div>
  );
}
