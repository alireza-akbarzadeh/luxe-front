'use client';

import { IconAlertTriangle } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

export function StoreErrorState({
  message,
  onRetryAction
}: {
  message?: string;
  onRetryAction?: () => void;
}) {
  const t = useTranslations('stores.detail.error');

  return (
    <div
      role='alert'
      className='border-destructive/30 bg-destructive/5 flex flex-col items-center justify-center rounded-2xl border px-6 py-16 text-center'
    >
      <IconAlertTriangle className='text-destructive mb-3 h-10 w-10' />
      <h3 className='text-lg font-semibold'>{t('title')}</h3>
      <p className='text-muted-foreground mt-1 max-w-md text-sm'>{message ?? t('loadFailed')}</p>
      {onRetryAction && (
        <Button onClick={onRetryAction} className='mt-6 rounded-full'>
          {t('retry')}
        </Button>
      )}
    </div>
  );
}
