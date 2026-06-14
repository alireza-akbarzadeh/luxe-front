'use client';

import { useCallback } from 'react';

import { AXIOS_INSTANCE } from '@/lib/api/api-client';

import { useDashboardStore } from '../admin.store';

/** Optimistic mark-read actions for the notification bell. */
export function useAdminNotificationActions() {
  const markAsReadLocal = useDashboardStore((state) => state.markAsRead);
  const markAllReadLocal = useDashboardStore((state) => state.markAllRead);

  const markAsRead = useCallback(
    async (id: string) => {
      markAsReadLocal(id);
      try {
        await AXIOS_INSTANCE.put(`/ws/notifications/${id}/read`);
      } catch {
        // Keep optimistic UI; history reloads on next dashboard visit.
      }
    },
    [markAsReadLocal]
  );

  const markAllRead = useCallback(async () => {
    markAllReadLocal();
    try {
      await AXIOS_INSTANCE.put('/ws/notifications/read-all');
    } catch {
      // noop
    }
  }, [markAllReadLocal]);

  return { markAsRead, markAllRead };
}
