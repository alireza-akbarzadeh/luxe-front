import type { PropsWithChildren } from 'react';

import { Footer } from '@/components/footer/footer';
import { Navbar } from '@/components/navbar/navbar';
import { SiteRealtimeProvider } from '@/lib/realtime/site-realtime-provider';
import { cn } from '@/lib/utils';

type TRootLayout = Readonly<PropsWithChildren>;

export default function SiteLayout({ children }: TRootLayout) {
  return (
    <>
      <Navbar />
      <SiteRealtimeProvider>
        <main
          className={cn(
            'bg-background app-container xs:px-4 flex min-h-screen flex-col pt-16 sm:px-6 lg:px-8 lg:pt-20'
          )}
        >
          {children}
        </main>
      </SiteRealtimeProvider>
      <Footer />
    </>
  );
}
