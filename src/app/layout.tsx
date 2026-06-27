import '../styles/globals.css';

import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Playfair_Display, Vazirmatn } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import type { PropsWithChildren } from 'react';

import { siteMetadata } from '@/_config';
import RootProvider from '@/components/providers/root';
import { LuxeSerwistProvider } from '@/components/providers/serwist-provider';
import { getDirection, type Locale } from '@/i18n/config';
import { cn } from '@/lib/utils';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

const playfairDisplay = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap'
});

const vazirmatn = Vazirmatn({
  variable: '--font-vazirmatn',
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap'
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

export default async function RootLayout({ children }: TRootLayout) {
  const locale = (await getLocale()) as Locale;
  const messages = await getMessages();
  const dir = getDirection(locale);

  return (
    <html
      lang={locale}
      dir={dir}
      className={cn(
        playfairDisplay.variable,
        geistSans.variable,
        geistMono.variable,
        vazirmatn.variable,
        locale === 'fa' && 'locale-fa'
      )}
      suppressHydrationWarning
      data-scroll-behavior='smooth'
    >
      <body
        className={cn('antialiased', locale === 'fa' && vazirmatn.className)}
        suppressHydrationWarning
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <LuxeSerwistProvider>
            <RootProvider dir={dir}>{children}</RootProvider>
          </LuxeSerwistProvider>
        </NextIntlClientProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
