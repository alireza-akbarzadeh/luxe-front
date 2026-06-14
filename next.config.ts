/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
import './src/env';

import type { NextConfig } from 'next';

const backendApiUrl = (
  process.env['BACKEND_API_URL'] ??
  process.env['NEXT_PUBLIC_API_URL'] ??
  'http://localhost:8080/api/v1'
).replace(/\/$/, '');

const config = {
  reactCompiler: true,
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${backendApiUrl}/:path*`
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

export default config;
