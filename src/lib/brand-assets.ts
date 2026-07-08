import type { Metadata } from 'next';

/**
 * Canonical paths for Luxe brand marks and install icons under `public/`.
 * Source files: logo wordmarks in `public/assets/`, PWA icons at `public/` root.
 */
export const BRAND_ASSETS = {
  logo: '/assets/logo.png',
  tinyLogo: '/assets/tiny-logo.png',
  logoOnDark: '/assets/logo-dark.png',
  faviconIco: '/favicon.ico',
  faviconSvg: '/favicon.svg',
  favicon16: '/favicon-16x16.png',
  favicon32: '/favicon-32x32.png',
  appleTouchIcon: '/apple-touch-icon.png',
  androidChrome192: '/android-chrome-192x192.png',
  androidChrome512: '/android-chrome-512x512.png',
  webManifest: '/app.webmanifest'
} as const;

/** Next.js metadata icons — favicon, Apple touch, and Android PWA sizes. */
export const siteIconsMetadata: NonNullable<Metadata['icons']> = {
  icon: [
    { url: BRAND_ASSETS.faviconIco },
    { url: BRAND_ASSETS.faviconSvg, type: 'image/svg+xml' },
    { url: BRAND_ASSETS.favicon16, sizes: '16x16', type: 'image/png' },
    { url: BRAND_ASSETS.favicon32, sizes: '32x32', type: 'image/png' },
    { url: BRAND_ASSETS.androidChrome192, sizes: '192x192', type: 'image/png' },
    { url: BRAND_ASSETS.androidChrome512, sizes: '512x512', type: 'image/png' }
  ],
  apple: [{ url: BRAND_ASSETS.appleTouchIcon, sizes: '180x180', type: 'image/png' }],
  shortcut: BRAND_ASSETS.faviconIco
};
