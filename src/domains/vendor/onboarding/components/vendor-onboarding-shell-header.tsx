'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export function VendorOnboardingShellHeader() {
  const t = useTranslations('vendor.onboarding.shell');

  return (
    <header className='border-border/50 flex items-center justify-between border-b px-4 py-4 sm:px-6'>
      <Link href='/vendor' className='inline-flex items-baseline gap-2'>
        <span className='text-xl font-bold tracking-tight'>LUXE</span>
        <span className='text-muted-foreground text-xs font-medium tracking-widest uppercase'>
          {t('brandSuffix')}
        </span>
      </Link>
      <Link
        href='/vendor/login'
        className='text-muted-foreground hover:text-foreground text-sm font-medium transition-colors'
      >
        {t('signIn')}
      </Link>
    </header>
  );
}
