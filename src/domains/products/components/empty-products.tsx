'use client';

import { IconPackageOff, IconRefresh, IconShoppingBag } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

interface EmptyProductsProps {
  onReset: () => void;
}

export function EmptyProducts({ onReset }: EmptyProductsProps) {
  const t = useTranslations('products.empty');

  return (
    <div className='border-border/60 from-muted/30 to-background flex flex-col items-center justify-center rounded-3xl border bg-linear-to-b px-6 py-20 text-center shadow-sm'>
      <div className='bg-muted/80 mb-5 flex h-16 w-16 items-center justify-center rounded-2xl'>
        <IconPackageOff className='text-muted-foreground h-8 w-8' />
      </div>
      <h3 className='font-display text-2xl font-semibold tracking-tight'>{t('title')}</h3>
      <p className='text-muted-foreground mt-2 max-w-md text-sm md:text-base'>{t('description')}</p>
      <div className='mt-6 flex flex-wrap items-center justify-center gap-3'>
        <Button variant='outline' className='rounded-full' onClick={onReset}>
          {t('reset')}
        </Button>
        <Button asChild className='rounded-full'>
          <Link href='/collections' className='gap-2'>
            <IconShoppingBag className='h-4 w-4' />
            {t('continueShopping')}
          </Link>
        </Button>
      </div>
    </div>
  );
}

interface ProductsErrorStateProps {
  onRetry: () => void;
}

export function ProductsErrorState({ onRetry }: ProductsErrorStateProps) {
  const t = useTranslations('shop.results');

  return (
    <div className='border-border bg-muted/20 flex flex-col items-center justify-center gap-4 rounded-3xl border py-20 text-center'>
      <p className='text-muted-foreground'>{t('loadFailed')}</p>
      <Button variant='outline' onClick={onRetry} className='gap-2 rounded-full'>
        <IconRefresh className='h-4 w-4' />
        {t('retry')}
      </Button>
    </div>
  );
}
