import type { PropsWithChildren } from 'react';
import { Navbar } from '~/src/components/navbar/navbar';
import { Footer } from '@/components/footer';
import { cn } from '~/src/lib/utils';

type TRootLayout = Readonly<PropsWithChildren>;

export default function SiteLayout({ children }: TRootLayout) {
  return (
    <>
      <Navbar />
      <main
        className={cn(
          'bg-background app-container xs:px-4 flex min-h-screen flex-col pt-16 sm:px-6 lg:px-8 lg:pt-20'
        )}
      >
        {children}
      </main>
      <Footer />
    </>
  );
}
