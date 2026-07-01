import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';

import { FooterClient } from '@/components/footer/footer-client';
import { MobileBottomNavClient } from '@/components/navbar/mobile-bottom-nav-client';
import { Navbar } from '@/components/navbar/navbar';
import { PwaInstallPromptClient } from '@/components/pwa/pwa-install-prompt-client';
import { prefetchSiteNavMenus } from '@/domains/menus/lib/prefetch-site-nav-menus';
import { SiteRealtimeProvider } from '@/lib/realtime/site-realtime-provider';

type TRootLayout = Readonly<PropsWithChildren>;

export default async function SiteLayout({ children }: TRootLayout) {
  const queryClient = await prefetchSiteNavMenus();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div id='site-layout'>
        <Navbar />
        <SiteRealtimeProvider>
          <main className='bg-background flex min-h-screen flex-col pt-16 pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pt-20 lg:pb-0'>
            {children}
          </main>
          <MobileBottomNavClient />
          <PwaInstallPromptClient />
        </SiteRealtimeProvider>
        <FooterClient />
      </div>
    </HydrationBoundary>
  );
}
