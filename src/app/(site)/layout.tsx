import type { PropsWithChildren } from 'react';

import { Footer } from '@/components/footer/footer';
import { Navbar } from '@/components/navbar/navbar';
import { PwaInstallPrompt } from '@/components/pwa/install-prompt';
import { SiteRealtimeProvider } from '@/lib/realtime/site-realtime-provider';

type TRootLayout = Readonly<PropsWithChildren>;

export default function SiteLayout({ children }: TRootLayout) {
  return (
    <div id='site-layout'>
      <Navbar />
      <SiteRealtimeProvider>
        <main className='bg-background flex min-h-screen flex-col pt-16 lg:pt-20'>{children}</main>
        <PwaInstallPrompt />
      </SiteRealtimeProvider>
      <Footer />
    </div>
  );
}
