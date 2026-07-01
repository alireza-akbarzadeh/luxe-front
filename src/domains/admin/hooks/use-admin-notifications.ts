'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import {
  markAccountNotificationRead,
  markAllAccountNotificationsRead
} from '@/domains/account/api/account-notifications-api';
import {
  ACCOUNT_NOTIFICATIONS_QUERY_KEY,
  useAccountNotifications
} from '@/domains/account/hooks/use-account-notifications';

const PANEL_LIMIT = 20;

/** Recent notifications for the admin header bell. */
export function useAdminNotificationsPanel() {
  return useAccountNotifications(PANEL_LIMIT, 0);
}

/** Mark-read mutations with query invalidation for admin notification UI. */
export function useAdminNotificationActions() {
  const queryClient = useQueryClient();

  const markOneMutation = useMutation({
    mutationFn: (id: number) => markAccountNotificationRead(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ACCOUNT_NOTIFICATIONS_QUERY_KEY });
    }
  });

  const markAllMutation = useMutation({
    mutationFn: markAllAccountNotificationsRead,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ACCOUNT_NOTIFICATIONS_QUERY_KEY });
    }
  });

  const { mutateAsync: markOneAsync, isPending: isMarkingRead } = markOneMutation;
  const { mutateAsync: markAllAsync, isPending: isMarkingAllRead } = markAllMutation;

  const markAsRead = useCallback(
    async (id: number) => {
      await markOneAsync(id);
    },
    [markOneAsync]
  );

  const markAllRead = useCallback(async () => {
    await markAllAsync();
  }, [markAllAsync]);

  return {
    markAsRead,
    markAllRead,
    isMarkingRead,
    isMarkingAllRead
  };
}
