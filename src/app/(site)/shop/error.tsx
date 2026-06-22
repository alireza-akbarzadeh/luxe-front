'use client';

import { IconRefresh } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

export default function ShopError({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('shop.error');

  return (
    <div className='app-container flex min-h-[50vh] flex-col items-center justify-center gap-4 py-20 text-center'>
      <h2 className='text-xl font-semibold'>{t('title')}</h2>
      <p className='text-muted-foreground max-w-md text-sm'>{t('description')}</p>
      <Button variant='outline' onClick={reset} className='gap-2 rounded-full'>
        <IconRefresh className='h-4 w-4' />
        {t('retry')}
      </Button>
    </div>
  );
}
