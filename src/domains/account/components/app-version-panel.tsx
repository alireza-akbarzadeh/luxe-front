'use client';

import { IconVersions } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { APP_BUILD_ID, APP_VERSION, formatAppVersionLabel } from '@/lib/app-version';

export function AppVersionPanel() {
  const t = useTranslations('account.settings');

  return (
    <div className='bg-card border-border rounded-2xl border p-6 sm:p-7'>
      <div className='flex items-start gap-3'>
        <div className='bg-muted flex size-10 shrink-0 items-center justify-center rounded-lg'>
          <IconVersions className='text-muted-foreground size-5' />
        </div>
        <div className='min-w-0 flex-1'>
          <h3 className='font-display text-lg font-semibold tracking-tight'>
            {t('appVersionTitle')}
          </h3>
          <p className='text-muted-foreground mt-1 text-sm'>{t('appVersionBody')}</p>
          <dl className='mt-4 grid gap-2 text-sm sm:grid-cols-2'>
            <div>
              <dt className='text-muted-foreground'>{t('appVersionRelease')}</dt>
              <dd className='font-medium tabular-nums'>v{APP_VERSION}</dd>
            </div>
            <div>
              <dt className='text-muted-foreground'>{t('appVersionBuild')}</dt>
              <dd className='font-mono text-xs font-medium'>{APP_BUILD_ID}</dd>
            </div>
          </dl>
          <p className='text-muted-foreground mt-3 text-xs'>{formatAppVersionLabel()}</p>
        </div>
      </div>
    </div>
  );
}
