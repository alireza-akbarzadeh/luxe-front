import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { PlusLandingDomain } from '@/domains/plus/plus-landing.domain';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('plus.meta');

  return {
    title: t('title'),
    description: t('description')
  };
}

export default function PlusLandingPage() {
  return <PlusLandingDomain />;
}
