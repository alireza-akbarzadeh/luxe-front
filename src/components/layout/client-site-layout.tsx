'use client';

import dynamic from 'next/dynamic';
import type { PropsWithChildren } from 'react';

import { SiteRealtimeProvider } from '@/lib/realtime/site-realtime-provider';

const FooterClient = dynamic(
  () => import('@/components/footer/footer-client').then((m) => m.FooterClient),
  { ssr: false }
);

const MobileBottomNavClient = dynamic(
  () => import('@/components/navbar/mobile-bottom-nav-client').then((m) => m.MobileBottomNavClient),
  { ssr: false }
);

const PwaInstallPromptClient = dynamic(
  () => import('@/components/pwa/pwa-install-prompt-client').then((m) => m.PwaInstallPromptClient),
  { ssr: false }
);

/** Below-fold storefront chrome — deferred client bundles for faster initial hydration. */
export function ClientSiteLayout({ children }: PropsWithChildren) {
  return (
    <>
      <SiteRealtimeProvider>
        <main className='bg-background flex min-h-screen flex-col pt-16 pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pt-20 lg:pb-0'>
          {children}
        </main>
        <MobileBottomNavClient />
        <PwaInstallPromptClient />
      </SiteRealtimeProvider>
      <FooterClient />
    </>
  );
}
