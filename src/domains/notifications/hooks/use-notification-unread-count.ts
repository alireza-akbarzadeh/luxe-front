'use client';

import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/components/providers/auth-provider';
import { fetchAccountNotifications } from '@/domains/account/api/account-notifications-api';
import { ACCOUNT_NOTIFICATIONS_QUERY_KEY } from '@/domains/account/hooks/use-account-notifications';
import { countUnreadNotifications } from '@/domains/account/lib/notification-utils';

/**
 * Lightweight unread badge count for the navbar notification icon.
 */
export function useNotificationUnreadCount() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: [...ACCOUNT_NOTIFICATIONS_QUERY_KEY, 'unread-count'],
    queryFn: async () => {
      const { notifications } = await fetchAccountNotifications({ limit: 100, offset: 0 });
      return countUnreadNotifications(notifications);
    },
    enabled: isAuthenticated,
    staleTime: 30_000
  });
}
