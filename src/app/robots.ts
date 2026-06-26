import type { MetadataRoute } from 'next';

import { absoluteUrl } from '@/lib/seo/site-url';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/vendor/panel/',
          '/vendor/login',
          '/login',
          '/register',
          '/forgot-password',
          '/reset-password',
          '/verify-email',
          '/welcome',
          '/cart',
          '/checkout',
          '/account',
          '/wishlist',
          '/compare',
          '/notifications',
          '/order-confirmed/',
          '/order-tracking/',
          '/unauthorized'
        ]
      }
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/')
  };
}
