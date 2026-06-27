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

  if (path === '/account' || path.startsWith('/account/')) {
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
  // Preload + Turbopack dev aborts navigations; disabled — NetworkOnly still handles sensitive routes.
  navigationPreload: false,
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

interface PushPayload {
  title?: string;
  body?: string;
  url?: string;
  tag?: string;
  icon?: string;
}

function parsePushPayload(event: PushEvent): PushPayload {
  const fallback: PushPayload = {
    title: 'Luxe',
    body: '',
    url: '/notifications',
    tag: 'luxe-notification'
  };

  if (!event.data) {
    return fallback;
  }

  try {
    const parsed = event.data.json() as PushPayload;
    return { ...fallback, ...parsed };
  } catch {
    const text = event.data.text();
    return { ...fallback, body: text || fallback.body };
  }
}

self.addEventListener('push', (event: PushEvent) => {
  const payload = parsePushPayload(event);

  event.waitUntil(
    self.registration.showNotification(payload.title ?? 'Luxe', {
      body: payload.body,
      tag: payload.tag,
      icon: payload.icon ?? '/favicon.svg',
      badge: '/favicon.svg',
      data: { url: payload.url ?? '/notifications' }
    })
  );
});

self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();

  const targetUrl = (event.notification.data?.url as string | undefined) ?? '/notifications';
  const absoluteUrl = new URL(targetUrl, self.location.origin).href;

  event.waitUntil(
    (async () => {
      const windowClients = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true
      });

      for (const client of windowClients) {
        if (!('focus' in client)) {
          continue;
        }

        await client.focus();

        if ('navigate' in client) {
          await (client as WindowClient).navigate(absoluteUrl);
        }

        return;
      }

      await self.clients.openWindow(absoluteUrl);
    })()
  );
});
