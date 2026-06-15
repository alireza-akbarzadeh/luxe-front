import React from 'react';

import { Footer } from '@/components/footer/footer';
import { Navbar } from '@/components/navbar/navbar';

interface BaseLayoutProps {
  children?: React.ReactNode;
}
export function BaseLayout(props: BaseLayoutProps) {
  const { children } = props;
  return (
    <div id='luxe-base-layout' className='bg-background'>
      <Navbar />
      <main className='bg-background flex min-h-screen flex-col pt-16 lg:pt-20'>
        {children}
      </main>
      <Footer />
    </div>
  );
}
