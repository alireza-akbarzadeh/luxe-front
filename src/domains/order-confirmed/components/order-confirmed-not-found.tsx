'use client';

import { IconShoppingBag } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

/** Inline not-found — avoids segment not-found.tsx i18n issues after Stripe redirect. */
export function OrderConfirmedNotFound() {
  const t = useTranslations('errors.orderConfirmed');
  const tCommon = useTranslations('errors.common');

  return (
    <div className='flex min-h-[60vh] items-center justify-center px-4 pt-24 pb-16'>
      <div className='text-center'>
        <h1 className='mb-2 text-2xl font-bold'>{t('notFoundTitle')}</h1>
        <p className='text-muted-foreground mb-6 max-w-md text-sm'>{t('notFoundDescription')}</p>
        <div className='flex items-center justify-center gap-3'>
          <Button asChild variant='outline' className='gap-2 rounded-full'>
            <Link href='/shop'>
              <IconShoppingBag className='h-4 w-4' />
              {t('primaryAction')}
            </Link>
          </Button>
          <Button asChild variant='link' className='gap-2'>
            <Link href='/'>{tCommon('goHome')}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
