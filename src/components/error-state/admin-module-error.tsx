'use client';

import { IconRefresh } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

type AdminModuleKey =
  | 'orders'
  | 'order'
  | 'shipments'
  | 'shipment'
  | 'returns'
  | 'return'
  | 'invoices'
  | 'invoice'
  | 'discounts'
  | 'stores'
  | 'wallet'
  | 'webhooks'
  | 'revenue';

export function AdminModuleError({
  module,
  error,
  reset,
  variant = 'default'
}: {
  module: AdminModuleKey;
  error: Error & { digest?: string };
  reset: () => void;
  variant?: 'default' | 'revenue';
}) {
  const t = useTranslations('errors.admin.moduleError');
  const tModule = useTranslations(`errors.admin.modules.${module}`);

  if (variant === 'revenue') {
    return (
      <div className='flex min-h-[420px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed p-8 text-center'>
        <div>
          <h2 className='text-lg font-semibold'>{tModule('title')}</h2>
          <p className='text-muted-foreground mt-1 max-w-md text-sm'>{tModule('description')}</p>
        </div>
        <Button variant='outline' onClick={reset}>
          <IconRefresh className='mr-2 h-4 w-4' />
          {tModule('retry')}
        </Button>
      </div>
    );
  }

  return (
    <div className='rounded-xl border border-dashed p-12 text-center'>
      <h2 className='text-lg font-semibold'>{tModule('title')}</h2>
      <p className='text-muted-foreground mt-2 text-sm'>{error.message}</p>
      <Button className='mt-4' variant='outline' onClick={reset}>
        {t('tryAgain')}
      </Button>
    </div>
  );
}
