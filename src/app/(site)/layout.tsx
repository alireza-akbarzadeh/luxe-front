import type { PropsWithChildren } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { cn } from '~/src/lib/utils';
import { APP_CONFIG } from '~/src/lib/config';

type TRootLayout = Readonly<PropsWithChildren>;

export default function SiteLayout({ children }: TRootLayout) {
  return (
    <>
      <Navbar />
      <main
        className={cn(
          'bg-background flex min-h-screen flex-col px-4 pt-16 sm:px-6 lg:px-8 lg:pt-20',
          APP_CONFIG.CONTAINER_SPACING_PADDING
        )}
      >
        {children}
      </main>
      <Footer />
    </>
  );
}
