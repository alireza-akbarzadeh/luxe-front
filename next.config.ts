/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
import './src/env';

import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { withSerwist } from '@serwist/turbopack';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const backendApiUrl = (
  process.env['BACKEND_API_URL'] ??
  process.env['NEXT_PUBLIC_API_URL'] ??
  'http://localhost:8080/api/v1'
).replace(/\/$/, '');

const config = {
  reactCompiler: true,
  reactStrictMode: true,
  serverExternalPackages: ['esbuild'],
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${backendApiUrl}/:path*`
      }
    ];
  },
  async redirects() {
    return [
      {
        source: '/stores',
        destination: '/store',
        permanent: true
      },
      {
        source: '/stores/:slug',
        destination: '/store/:slug',
        permanent: true
      },
      {
        source: '/sell',
        destination: '/contact',
        permanent: false
      },
      {
        source: '/vendor/login',
        destination: '/login?callbackUrl=%2Fdashboard',
        permanent: false
      },
      {
        source: '/products',
        destination: '/shop',
        permanent: true
      }
    ];
  },
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      }
    ]
  }
} satisfies NextConfig;

export default withSerwist(withNextIntl(config));
