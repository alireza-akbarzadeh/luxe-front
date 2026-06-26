import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { VendorLoginDomain } from '@/domains/vendor/auth/vendor-login.domain';
import { getServerUser } from '@/lib/auth/auth-server';
import { getServerVendorStores, isVendorPanelAdmin } from '@/lib/auth/vendor-server';

export default async function VendorLoginPage() {
  const user = await getServerUser();

  if (user) {
    const stores = await getServerVendorStores();
    if (stores.length > 0 || isVendorPanelAdmin(user)) {
      redirect('/vendor/panel');
    }
    redirect('/vendor/apply');
  }

  return (
    <Suspense fallback={null}>
      <VendorLoginDomain />
    </Suspense>
  );
}
