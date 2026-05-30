import '../styles/globals.css';

import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Nunito_Sans } from 'next/font/google';
import type { PropsWithChildren } from 'react';

import { siteMetadata } from '@/_config';
import RootProvider from '@/components/providers/root';

const nunitoSans = Nunito_Sans({ variable: '--font-sans' });

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  ...siteMetadata,
  icons: '/favicon.svg',
  manifest: '/app.webmanifest',
  applicationName: 'Luxe',
  appleWebApp: {
    capable: true,
    title: 'Luxe',
    statusBarStyle: 'black-translucent'
  },
  formatDetection: {
    telephone: false
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000'
};

type TRootLayout = Readonly<PropsWithChildren>;

export default function RootLayout({ children }: TRootLayout) {
  return (
    <html
      lang='en'
      className={nunitoSans.variable}
      suppressHydrationWarning
      data-scroll-behavior='smooth'
    >
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <RootProvider>{children}</RootProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
