'use client';

import { useTranslations } from 'next-intl';

import { AdminErrorState } from '@/components/cart/admin-error-state';

export default function VendorPanelError() {
  const t = useTranslations('errors.vendor.error');

  return (
    <AdminErrorState
      code='500'
      badge={t('badge')}
      tone='danger'
      title={t('title')}
      description={t('description')}
      primary={{ label: t('primary'), href: '/vendor/panel' }}
      secondary={{ label: t('secondary'), href: '/vendor' }}
    />
  );
}
