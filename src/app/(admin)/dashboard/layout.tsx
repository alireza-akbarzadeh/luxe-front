import { forbidden, redirect } from 'next/navigation';
import type { PropsWithChildren } from 'react';

import { AppSidebarLayout } from '@/domains/admin/components/app-sidebar-layout';
import { getServerUser } from '@/lib/auth/auth-server';

type TRootLayout = Readonly<PropsWithChildren>;

export default async function DashboardLayout({ children }: TRootLayout) {
  const user = await getServerUser();

  if (!user) {
    redirect('/login');
  }

  if (user?.role !== 'admin' && user?.role !== 'moderator') {
    return forbidden();
  }
  return <AppSidebarLayout>{children}</AppSidebarLayout>;
}
