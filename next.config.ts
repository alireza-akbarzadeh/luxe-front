/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
import './src/env';

import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

import { withSentryConfig } from '@sentry/nextjs';
import { withSerwist } from '@serwist/turbopack';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

import { resolveApiBaseUrl } from './src/lib/api/api-base-url';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const backendApiUrl = resolveApiBaseUrl();

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as {
  version?: string;
};

function resolveBuildId(): string {
  if (process.env['VERCEL_GIT_COMMIT_SHA']) {
    return process.env['VERCEL_GIT_COMMIT_SHA'].slice(0, 7);
  }
  try {
    return execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
  } catch {
    return 'dev';
  }
}

const appVersion = pkg.version ?? '0.0.0';
const buildId = resolveBuildId();

const config = {
  env: {
    NEXT_PUBLIC_APP_VERSION: appVersion,
    NEXT_PUBLIC_BUILD_ID: buildId
  },
  reactCompiler: true,
  reactStrictMode: true,
  compiler: {
    removeConsole:
      process.env['NODE_ENV'] === 'production' ? { exclude: ['error', 'warn', 'info'] } : false
  },
  serverExternalPackages: ['esbuild'],
  experimental: {
    optimizePackageImports: [
      '@tabler/icons-react',
      'framer-motion',
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      '@radix-ui/react-tooltip',
      '@tanstack/react-query',
      '@tanstack/react-table'
    ]
  },
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
      }
    ];
  },
  images: {
    dangerouslyAllowLocalIP: true,
    minimumCacheTTL: 60 * 60 * 24,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      }
    ]
  },
  logging: {
    browserToTerminal: process.env.NODE_ENV !== 'production',
    fetches: {
      hmrRefreshes: true,
      fullUrl: true
    }
  }
} satisfies NextConfig;

const appConfig = withSerwist(withNextIntl(config));

const sentryBuildOptions = {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: 'devtools-pk',

  project: 'luxe-front',

  // Only print logs for uploading source maps in CI
  silent: !process.env['CI'],

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: '/monitoring',

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true
    }
  }
} as const;

/** Skip Sentry webpack/turbopack hooks in local dev — avoids intermittent instrumentation cache errors. */
const enableSentryBuild =
  process.env['NODE_ENV'] === 'production' || process.env['SENTRY_ENABLE_DEV'] === 'true';

export default enableSentryBuild ? withSentryConfig(appConfig, sentryBuildOptions) : appConfig;
