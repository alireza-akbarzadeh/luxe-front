/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { defaultCache } from '@serwist/turbopack/worker';
import type { PrecacheEntry, RuntimeCaching, SerwistGlobalConfig } from 'serwist';
import { NetworkOnly, Serwist } from 'serwist';

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

/** Never cache auth, checkout, cart mutations, or admin/vendor panel traffic. */
function isSensitiveUrl(url: URL): boolean {
  const path = url.pathname;

  if (path.startsWith('/dashboard') || path.startsWith('/vendor/panel')) {
    return true;
  }

  if (
    path.startsWith('/api/v1/auth') ||
    path.startsWith('/api/v1/cart') ||
    path.startsWith('/api/v1/checkout') ||
    path.startsWith('/api/v1/account') ||
    path.startsWith('/api/v1/admin') ||
    path.startsWith('/api/v1/webhooks')
  ) {
    return true;
  }

  return (
    path === '/login' ||
    path === '/register' ||
    path === '/forgot-password' ||
    path.startsWith('/reset-password') ||
    path.startsWith('/verify-email')
  );
}

const sensitiveRoutesCache: RuntimeCaching = {
  matcher({ url }) {
    return isSensitiveUrl(url);
  },
  handler: new NetworkOnly()
};

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [sensitiveRoutesCache, ...defaultCache],
  fallbacks: {
    entries: [
      {
        url: '/~offline',
        matcher({ request }) {
          return request.destination === 'document';
        }
      }
    ]
  }
});

serwist.addEventListeners();
