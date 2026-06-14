import { AXIOS_INSTANCE } from '@/lib/api/api-client';

export interface AccountNotification {
  id: number;
  user_id?: number;
  type: string;
  title: string;
  message: string;
  data?: string;
  is_read: boolean;
  created_at: string;
}

interface NotificationsListPayload {
  notifications?: AccountNotification[];
  total?: number;
  limit?: number;
  offset?: number;
}

interface ApiEnvelope<T> {
  success?: boolean;
  data?: T;
  message?: string;
}

export async function fetchAccountNotifications(params: {
  limit: number;
  offset: number;
}): Promise<{
  notifications: AccountNotification[];
  total: number;
  limit: number;
  offset: number;
}> {
  const response = await AXIOS_INSTANCE.get<ApiEnvelope<NotificationsListPayload>>(
    '/ws/notifications',
    { params }
  );

  const payload = response.data.data;

  return {
    notifications: payload?.notifications ?? [],
    total: payload?.total ?? 0,
    limit: payload?.limit ?? params.limit,
    offset: payload?.offset ?? params.offset
  };
}

export async function markAccountNotificationRead(id: number): Promise<void> {
  await AXIOS_INSTANCE.put(`/ws/notifications/${id}/read`);
}

export async function markAllAccountNotificationsRead(): Promise<void> {
  await AXIOS_INSTANCE.put('/ws/notifications/read-all');
}
