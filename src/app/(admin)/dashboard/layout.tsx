import type { PropsWithChildren } from 'react';

import { AppSidebarLayout } from '@/domains/admin/components/app-sidebar-layout';

type TRootLayout = Readonly<PropsWithChildren>;

export default function DashboardLayout({ children }: TRootLayout) {
  return <AppSidebarLayout>{children}</AppSidebarLayout>;
}
