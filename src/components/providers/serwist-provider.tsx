'use client';

import { SerwistProvider } from '@serwist/turbopack/react';
import { type PropsWithChildren, useEffect } from 'react';

const isDev = process.env.NODE_ENV === 'development';
/** Local `pnpm start` has no Vercel env — Serwist NetworkFirst breaks Lighthouse and offline audits. */
const disableSw = isDev || process.env['NEXT_PUBLIC_VERCEL_ENV'] === undefined;

/** Unregister stale SW when disabled (dev or local `pnpm start` without Vercel env). */
function useServiceWorkerCleanupWhenDisabled() {
  useEffect(() => {
    if (!disableSw || !('serviceWorker' in navigator)) {
      return;
    }

    void navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        void registration.unregister();
      }
    });
  }, []);
}

/**
 * PWA service worker — disabled in development.
 * Serwist + Turbopack dev can abort navigations (NetworkOnly / preload warnings on /account, etc.).
 */
export function LuxeSerwistProvider({ children }: PropsWithChildren) {
  useServiceWorkerCleanupWhenDisabled();

  return (
    <SerwistProvider swUrl='/serwist/sw.js' disable={disableSw}>
      {children}
    </SerwistProvider>
  );
}
