'use client';

import { useTranslations } from 'next-intl';

import { AdminErrorState } from '@/components/cart/admin-error-state';

export default function DashboardNotFound() {
  const t = useTranslations('errors.admin.notFound');

  return (
    <AdminErrorState
      code='404'
      badge={t('badge')}
      tone='warn'
      title={t('title')}
      description={t('description')}
      primary={{ label: t('primary'), href: '/dashboard' }}
      secondary={{ label: t('secondary'), href: '/dashboard/orders' }}
    />
  );
}
