'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { useRealtimeSubscribe } from '@/lib/realtime/realtime-provider';

import { ACCOUNT_NOTIFICATIONS_QUERY_KEY } from '../hooks/use-account-notifications';

/** Applies live WebSocket notification events to the TanStack Query cache. */
export function AccountNotificationsSync() {
  const queryClient = useQueryClient();

  const handleMessage = useCallback(
    (raw: unknown) => {
      if (!raw || typeof raw !== 'object') return;

      const message = raw as { type?: string };
      if (message.type !== 'notification') return;

      void queryClient.invalidateQueries({ queryKey: ACCOUNT_NOTIFICATIONS_QUERY_KEY });
    },
    [queryClient]
  );

  useRealtimeSubscribe(handleMessage);

  return null;
}
