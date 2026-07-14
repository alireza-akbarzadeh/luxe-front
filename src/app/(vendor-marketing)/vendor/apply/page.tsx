import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { VendorOnboardingShell } from '@/domains/vendor/onboarding/components/vendor-onboarding-shell';
import { VendorOnboardingDomain } from '@/domains/vendor/onboarding/vendor-onboarding.domain';
import { getServerUser } from '@/lib/auth/auth-server';
import { getServerVendorStores, isVendorPanelAdmin } from '@/lib/auth/vendor-server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('vendor.onboarding.meta.apply');

  return {
    title: t('title'),
    description: t('description')
  };
}

export default async function VendorApplyPage() {
  const user = await getServerUser();

  if (user) {
    const stores = await getServerVendorStores();
    if (stores.length > 0 && !isVendorPanelAdmin(user)) {
      redirect('/vendor/panel');
    }
  }

  return (
    <VendorOnboardingShell>
      <VendorOnboardingDomain
        isAuthenticated={Boolean(user)}
        userEmail={user?.email ?? undefined}
      />
    </VendorOnboardingShell>
  );
}
