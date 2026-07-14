import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

import { VendorOnboardingShell } from '@/domains/vendor/onboarding/components/vendor-onboarding-shell';
import { VendorOnboardingSuccessDomain } from '@/domains/vendor/onboarding/vendor-onboarding-success.domain';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('vendor.onboarding.meta.success');

  return {
    title: t('title'),
    description: t('description')
  };
}

export default function VendorApplySuccessPage() {
  return (
    <VendorOnboardingShell>
      <Suspense fallback={null}>
        <VendorOnboardingSuccessDomain />
      </Suspense>
    </VendorOnboardingShell>
  );
}
