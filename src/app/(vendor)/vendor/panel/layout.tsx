import { redirect } from 'next/navigation';
import type { PropsWithChildren } from 'react';

import { VendorPanelShell } from '@/domains/vendor/panel/components/vendor-panel-shell';
import { getServerUser } from '@/lib/auth/auth-server';

type VendorPanelLayoutProps = Readonly<PropsWithChildren>;

export default async function VendorPanelLayout({ children }: VendorPanelLayoutProps) {
  const user = await getServerUser();

  if (!user) {
    redirect('/vendor/login?callbackUrl=/vendor/panel');
  }

  return <VendorPanelShell user={user}>{children}</VendorPanelShell>;
}
