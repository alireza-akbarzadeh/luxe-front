import type { Metadata } from 'next';
import { forbidden, redirect } from 'next/navigation';
import type { PropsWithChildren } from 'react';

import { AppSidebarLayout } from '@/domains/admin/components/app-sidebar-layout';
import { getServerUser } from '@/lib/auth/auth-server';
import { noIndexMetadata } from '@/lib/seo/metadata';

type TRootLayout = Readonly<PropsWithChildren>;

export const metadata: Metadata = noIndexMetadata('Dashboard');

export default async function DashboardLayout({ children }: TRootLayout) {
  const user = await getServerUser();

  if (!user) {
    redirect('/login');
  }

  if (user?.role === 'user') {
    return forbidden();
  }
  return <AppSidebarLayout>{children}</AppSidebarLayout>;
}
