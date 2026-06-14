'use client';

import { formatDistanceToNow } from 'date-fns';
import { useCallback, useEffect } from 'react';

import { AXIOS_INSTANCE } from '@/lib/api/api-client';
import { useRealtimeSubscribe } from '@/lib/realtime/realtime-provider';

import type { NotificationItem } from '../admin.store';
import { useDashboardStore } from '../admin.store';

interface ApiNotification {
  id: number;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

function mapNotification(item: ApiNotification): NotificationItem {
  return {
    id: String(item.id),
    title: item.title,
    description: item.message,
    time: formatDistanceToNow(new Date(item.created_at), { addSuffix: true }),
    read: item.is_read,
    type: item.type.includes('order') || item.type.includes('payment') ? 'alert' : 'system'
  };
}

/** Loads notification history and applies live WebSocket updates to the admin store. */
export function AdminNotificationsSync() {
  const setNotifications = useDashboardStore((state) => state.setNotifications);

  const loadNotifications = useCallback(async () => {
    try {
      const response = await AXIOS_INSTANCE.get<{
        success?: boolean;
        data?: { notifications?: ApiNotification[] };
      }>('/ws/notifications?limit=20');

      const items = response.data.data?.notifications ?? [];
      setNotifications(items.map(mapNotification));
    } catch {
      setNotifications([]);
    }
  }, [setNotifications]);

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  useRealtimeSubscribe((raw) => {
    if (!raw || typeof raw !== 'object') return;

    const message = raw as {
      type?: string;
      data?: Record<string, unknown>;
    };

    if (message.type !== 'notification' || !message.data) return;

    const payload = message.data;
    const createdAt = String(payload['created_at'] ?? new Date().toISOString());

    useDashboardStore.getState().prependNotification({
      id: String(payload['id'] ?? Date.now()),
      title: String(payload['title'] ?? 'Notification'),
      description: String(payload['message'] ?? ''),
      time: formatDistanceToNow(new Date(createdAt), { addSuffix: true }),
      read: false,
      type: 'alert'
    });
  });

  return null;
}
