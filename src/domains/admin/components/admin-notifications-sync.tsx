'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { toast } from 'sonner';

import { ACCOUNT_NOTIFICATIONS_QUERY_KEY } from '@/domains/account/hooks/use-account-notifications';
import { useRealtimeSubscribe } from '@/lib/realtime/realtime-provider';

interface NotificationPayload {
  title?: string;
  message?: string;
}

/** Live WebSocket → TanStack Query cache + toast for admin dashboard. */
export function AdminNotificationsSync() {
  const queryClient = useQueryClient();

  const handleMessage = useCallback(
    (raw: unknown) => {
      if (!raw || typeof raw !== 'object') return;

      const message = raw as { type?: string; data?: NotificationPayload };
      if (message.type !== 'notification') return;

      const title = message.data?.title ?? 'New notification';
      const description = message.data?.message;

      toast.info(title, description ? { description } : undefined);

      void queryClient.invalidateQueries({ queryKey: ACCOUNT_NOTIFICATIONS_QUERY_KEY });
    },
    [queryClient]
  );

  useRealtimeSubscribe(handleMessage);

  return null;
}
