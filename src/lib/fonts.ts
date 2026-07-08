import { Geist, Geist_Mono, Plus_Jakarta_Sans, Vazirmatn } from 'next/font/google';

/** Commerce / storefront — premium sans (English). */
export const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  adjustFontFallback: true,
  preload: true
});

/** Admin + vendor panel dashboards. */
export const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
  adjustFontFallback: true,
  preload: true
});

export const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
  preload: false
});

/** Persian (fa) — unchanged. */
export const vazirmatn = Vazirmatn({
  variable: '--font-vazirmatn',
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  adjustFontFallback: true,
  preload: false
});
