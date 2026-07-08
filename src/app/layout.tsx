import '../styles/globals.css';

import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import type { PropsWithChildren } from 'react';

import { siteMetadata } from '@/_config';
import { SpeedInsightsClient } from '@/components/analytics/speed-insights-client';
import RootProvider from '@/components/providers/root';
import { LuxeSerwistProvider } from '@/components/providers/serwist-provider';
import { getDirection, type Locale } from '@/i18n/config';
import { BRAND_ASSETS, siteIconsMetadata } from '@/lib/brand-assets';
import { geistMono, geistSans, plusJakartaSans, vazirmatn } from '@/lib/fonts';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  ...siteMetadata,
  icons: siteIconsMetadata,
  manifest: BRAND_ASSETS.webManifest,
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
        plusJakartaSans.variable,
        geistSans.variable,
        geistMono.variable,
        locale === 'fa' && vazirmatn.variable,
        locale === 'fa' && 'locale-fa'
      )}
      suppressHydrationWarning
      data-scroll-behavior='smooth'
    >
      <body
        className={cn(
          'font-shell-commerce font-sans antialiased',
          locale === 'fa' && vazirmatn.className
        )}
        suppressHydrationWarning
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <LuxeSerwistProvider>
            <RootProvider dir={dir}>{children}</RootProvider>
          </LuxeSerwistProvider>
        </NextIntlClientProvider>
        <SpeedInsightsClient />
      </body>
    </html>
  );
}
