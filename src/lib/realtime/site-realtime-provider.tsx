'use client';

import type { ReactNode } from 'react';

import { useAuth } from '@/components/providers/auth-provider';
import { AccountNotificationsSync } from '@/domains/account/components/account-notifications-sync';

import { RealtimeProvider } from './realtime-provider';

/**
 * Connects authenticated storefront users to the shared WebSocket for live notifications.
 */
export function SiteRealtimeProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return children;
  }

  return (
    <RealtimeProvider>
      <AccountNotificationsSync />
      {children}
    </RealtimeProvider>
  );
}
