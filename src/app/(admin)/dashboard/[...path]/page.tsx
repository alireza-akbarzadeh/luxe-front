'use client';

import { useTranslations } from 'next-intl';

import { AdminErrorState } from '@/components/cart/admin-error-state';

export default function CatchAllPath() {
  const t = useTranslations('errors.admin.catchAll');

  return (
    <AdminErrorState
      code='404'
      badge={t('badge')}
      tone='warn'
      title={t('title')}
      description={t('description')}
      primary={{ label: t('primary'), href: '/dashboard' }}
      secondary={{ label: t('secondary'), href: '/' }}
    />
  );
}
