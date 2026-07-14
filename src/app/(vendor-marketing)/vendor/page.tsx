import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { VendorLandingDomain } from '@/domains/vendor/landing/vendor-landing.domain';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('vendor.landing.screen');

  return {
    title: t('title'),
    description: t('subtitle')
  };
}

export default function VendorLandingPage() {
  return <VendorLandingDomain />;
}
