'use client';

import { SerwistProvider } from '@serwist/turbopack/react';
import { type PropsWithChildren, useEffect } from 'react';

const isDev = process.env.NODE_ENV === 'development';

/** Unregister a stale SW left over from a prior session (common after toggling dev disable). */
function useDevServiceWorkerCleanup() {
  useEffect(() => {
    if (!isDev || !('serviceWorker' in navigator)) {
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
  useDevServiceWorkerCleanup();

  return (
    <SerwistProvider swUrl='/serwist/sw.js' disable={isDev}>
      {children}
    </SerwistProvider>
  );
}
