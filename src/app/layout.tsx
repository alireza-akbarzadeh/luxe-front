import '../styles/globals.css';

import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Geist, Geist_Mono, Nunito_Sans, Playfair_Display, Vazirmatn } from 'next/font/google';
import Script from 'next/script';
import type { PropsWithChildren } from 'react';

import { siteMetadata } from '@/_config';
import RootProvider from '@/components/providers/root';
import { getDirection, type Locale } from '@/i18n/config';
import { themeInitScript } from '@/lib/theme';
import { cn } from '@/lib/utils';

const nunitoSans = Nunito_Sans({ variable: '--font-sans' });

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
  subsets: ['arabic'],
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
      className={`${nunitoSans.variable} ${playfairDisplay.variable}`}
      suppressHydrationWarning
      data-scroll-behavior='smooth'
    >
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          vazirmatn.variable,
          'antialiased'
        )}
        suppressHydrationWarning
      >
        <Script
          id='luxe-theme-init'
          strategy='beforeInteractive'
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <RootProvider dir={dir}>{children}</RootProvider>
        </NextIntlClientProvider>
      </body>
      <SpeedInsights />
    </html>
  );
}
