import React from 'react';

import { Footer } from '@/components/footer/footer';
import { Navbar } from '@/components/navbar/navbar';
import { cn } from '@/lib/utils';

interface BaseLayoutProps {
  children?: React.ReactNode;
}
export function BaseLayout(props: BaseLayoutProps) {
  const { children } = props;
  return (
    <div id='luxe-base-layout' className='bg-background'>
      <Navbar />
      <main
        className={cn(
          'bg-background app-container xs:px-4 flex min-h-screen flex-col pt-16 sm:px-6 lg:px-8 lg:pt-20'
        )}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
