'use client';

import { IconBell, IconShieldLock } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { ActiveSessionsPanel } from '../components/active-sessions-panel';
import { AppVersionPanel } from '../components/app-version-panel';
import { ChangePasswordPanel } from '../components/change-password-panel';
import { EmailVerificationPanel } from '../components/email-verification-panel';
import { PrivateShoppingPanel } from '../components/private-shopping-panel';

export function AccountSetting() {
  const t = useTranslations('account.settings');

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='font-display text-2xl font-semibold tracking-tight'>{t('title')}</h2>
        <p className='text-muted-foreground mt-1 text-sm'>{t('subtitle')}</p>
      </div>

      <ChangePasswordPanel />
      <EmailVerificationPanel />
      <ActiveSessionsPanel />
      <PrivateShoppingPanel />

      <AppVersionPanel />

      <div className='bg-card border-border rounded-2xl border p-6 sm:p-7'>
        <div className='mb-4 flex items-start gap-3'>
          <div className='bg-muted flex size-10 shrink-0 items-center justify-center rounded-lg'>
            <IconBell className='text-muted-foreground size-5' />
          </div>
          <div>
            <h3 className='font-display text-lg font-semibold tracking-tight'>
              {t('emailPreferencesTitle')}
            </h3>
            <p className='text-muted-foreground mt-1 text-sm'>{t('emailPreferencesBody')}</p>
          </div>
        </div>
      </div>

      <div className='border-border/80 bg-muted/30 rounded-2xl border p-6 sm:p-7'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
          <div className='flex gap-3'>
            <div className='bg-background flex size-10 shrink-0 items-center justify-center rounded-lg border'>
              <IconShieldLock className='text-muted-foreground size-5' />
            </div>
            <div>
              <h3 className='font-display text-lg font-semibold tracking-tight'>
                {t('deleteAccountTitle')}
              </h3>
              <p className='text-muted-foreground mt-1 max-w-xl text-sm'>
                {t('deleteAccountBody')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
