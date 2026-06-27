import type { PropsWithChildren } from 'react';

import { Footer } from '@/components/footer/footer';
import { MobileBottomNav } from '@/components/navbar/mobile-bottom-nav';
import { Navbar } from '@/components/navbar/navbar';
import { PwaInstallPrompt } from '@/components/pwa/install-prompt';
import { SiteRealtimeProvider } from '@/lib/realtime/site-realtime-provider';

type TRootLayout = Readonly<PropsWithChildren>;

export default function SiteLayout({ children }: TRootLayout) {
  return (
    <div id='site-layout'>
      <Navbar />
      <SiteRealtimeProvider>
        <main className='bg-background flex min-h-screen flex-col pt-16 pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pt-20 lg:pb-0'>
          {children}
        </main>
        <MobileBottomNav />
        <PwaInstallPrompt />
      </SiteRealtimeProvider>
      <Footer />
    </div>
  );
}
