'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  fetchAccountNotifications,
  markAccountNotificationRead,
  markAllAccountNotificationsRead
} from '../api/account-notifications-api';

export const ACCOUNT_NOTIFICATIONS_QUERY_KEY = ['account', 'notifications'] as const;

export function getAccountNotificationsQueryKey(limit: number, offset: number) {
  return [...ACCOUNT_NOTIFICATIONS_QUERY_KEY, { limit, offset }] as const;
}

export function useAccountNotifications(
  limit: number,
  offset: number,
  options?: { enabled?: boolean }
) {
  const queryClient = useQueryClient();
  const enabled = options?.enabled ?? true;

  const query = useQuery({
    queryKey: getAccountNotificationsQueryKey(limit, offset),
    queryFn: () => fetchAccountNotifications({ limit, offset }),
    enabled
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: number) => markAccountNotificationRead(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ACCOUNT_NOTIFICATIONS_QUERY_KEY });
    }
  });

  const markAllReadMutation = useMutation({
    mutationFn: markAllAccountNotificationsRead,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ACCOUNT_NOTIFICATIONS_QUERY_KEY });
    }
  });

  const notifications = query.data?.notifications ?? [];
  const total = query.data?.total ?? 0;
  const unreadOnPage = notifications.filter((item) => !item.is_read).length;

  return {
    notifications,
    total,
    unreadOnPage,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    markAsRead: markAsReadMutation.mutateAsync,
    isMarkingRead: markAsReadMutation.isPending,
    markAllRead: markAllReadMutation.mutateAsync,
    isMarkingAllRead: markAllReadMutation.isPending
  };
}
