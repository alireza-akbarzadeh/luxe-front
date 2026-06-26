'use client';

import { useTranslations } from 'next-intl';

import { AdminErrorState } from '@/components/cart/admin-error-state';

export default function Forbidden() {
  const t = useTranslations('errors.admin.forbidden');

  return (
    <AdminErrorState
      code='403'
      badge={t('badge')}
      tone='danger'
      title={t('title')}
      description={t('description')}
      primary={{ label: t('primary'), href: '/dashboard' }}
      secondary={{ label: t('secondary'), href: '/' }}
      meta={[
        { label: t('requiredRole'), value: t('adminRole') },
        { label: t('accessLevel'), value: t('restricted') },
        { label: t('scope'), value: t('scopeValue') }
      ]}
    />
  );
}
