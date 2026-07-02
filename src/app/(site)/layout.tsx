import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';

import { Navbar } from '@/components/navbar/navbar';
import { prefetchSiteNavMenus } from '@/domains/menus/lib/prefetch-site-nav-menus';
import { ClientSiteLayout } from '~/src/components/layout/client-site-layout';

type TRootLayout = Readonly<PropsWithChildren>;

export default async function SiteLayout({ children }: TRootLayout) {
  const queryClient = await prefetchSiteNavMenus();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div id='site-layout'>
        <Navbar />
        <ClientSiteLayout>{children}</ClientSiteLayout>
      </div>
    </HydrationBoundary>
  );
}
