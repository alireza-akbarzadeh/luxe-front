import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';

import { ClientSiteLayout } from '@/components/layout/client-site-layout';
import { Navbar } from '@/components/navbar/navbar';
import { prefetchSiteNavMenus } from '@/domains/menus/lib/prefetch-site-nav-menus';

type TRootLayout = Readonly<PropsWithChildren>;

export default async function SiteLayout({ children }: TRootLayout) {
  const queryClient = await prefetchSiteNavMenus();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div id='site-layout' className='font-shell-commerce min-h-screen font-sans'>
        <Navbar />
        <ClientSiteLayout>{children}</ClientSiteLayout>
      </div>
    </HydrationBoundary>
  );
}
