import { AXIOS_INSTANCE } from '@/lib/api/api-client';

interface ApiEnvelope<T> {
  success?: boolean;
  data?: T;
  message?: string;
}

export interface VapidPublicKeyPayload {
  public_key: string;
  enabled: boolean;
}

export interface PushSubscriptionPayload {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export async function fetchVapidPublicKey(): Promise<VapidPublicKeyPayload> {
  const response = await AXIOS_INSTANCE.get<ApiEnvelope<VapidPublicKeyPayload>>(
    '/push/vapid-public-key'
  );

  return {
    public_key: response.data.data?.public_key ?? '',
    enabled: response.data.data?.enabled ?? false
  };
}

export async function registerPushSubscription(payload: PushSubscriptionPayload): Promise<void> {
  await AXIOS_INSTANCE.post('/account/push/subscriptions', payload);
}

export async function deletePushSubscription(endpoint: string): Promise<void> {
  await AXIOS_INSTANCE.delete('/account/push/subscriptions', {
    data: { endpoint }
  });
}

export async function sendTestPushNotification(): Promise<void> {
  await AXIOS_INSTANCE.post('/account/push/test');
}
