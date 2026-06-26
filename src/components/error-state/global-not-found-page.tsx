'use client';

import { useTranslations } from 'next-intl';

import { SiteErrorState } from '@/components/error-state/site-error-state';

export function GlobalNotFoundPage() {
  const t = useTranslations('errors.global.notFound');

  return (
    <SiteErrorState
      code='404'
      eyebrow={t('eyebrow')}
      title={t('title')}
      description={t('description')}
      primary={{
        label: t('primary'),
        href: '/'
      }}
      secondary={{
        label: t('secondary'),
        href: '/best-sellers'
      }}
      accent='from-sky-200/60 via-indigo-200/40 to-rose-200/50'
    />
  );
}
