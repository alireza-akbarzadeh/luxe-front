import Link from 'next/link';
import { redirect } from 'next/navigation';

import { VendorOnboardingDomain } from '@/domains/vendor/onboarding/vendor-onboarding.domain';
import { getServerUser } from '@/lib/auth/auth-server';
import { getServerVendorStores, isVendorPanelAdmin } from '@/lib/auth/vendor-server';

export default async function VendorApplyPage() {
  const user = await getServerUser();

  if (user) {
    const stores = await getServerVendorStores();
    if (stores.length > 0 && !isVendorPanelAdmin(user)) {
      redirect('/vendor/panel');
    }
  }

  return (
    <div className='min-h-screen'>
      <header className='border-border/50 border-b px-4 py-4 sm:px-6'>
        <Link
          href='/vendor'
          className='text-muted-foreground hover:text-foreground text-sm font-medium'
        >
          ← Back to seller overview
        </Link>
      </header>
      <VendorOnboardingDomain
        isAuthenticated={Boolean(user)}
        userEmail={user?.email ?? undefined}
      />
    </div>
  );
}
