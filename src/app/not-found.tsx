import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { GlobalNotFoundPage } from '@/components/error-state/global-not-found-page';
import { BaseLayout } from '@/components/layouts/base-layout';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('errors.global.notFound');

  return {
    title: t('metadataTitle'),
    description: t('metadataDescription')
  };
}

export default function NotFound() {
  return (
    <BaseLayout>
      <GlobalNotFoundPage />
    </BaseLayout>
  );
}
