/**
 * Web Push helpers — subscribe/unsubscribe via the Serwist service worker.
 */

import { deleteAccountPushSubscriptions } from '@/services/-account-push-subscriptions-delete';
import { postAccountPushSubscriptions } from '@/services/-account-push-subscriptions-post';
import { getPushVapidPublicKey } from '@/services/-push-vapid-public-key-get';

export type PushSupportStatus = 'unsupported' | 'denied' | 'default' | 'granted';

export function getPushSupportStatus(): PushSupportStatus {
  if (typeof window === 'undefined') {
    return 'unsupported';
  }

  if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) {
    return 'unsupported';
  }

  return Notification.permission as PushSupportStatus;
}

/** Converts a URL-safe base64 VAPID key to a Uint8Array for PushManager.subscribe(). */
export function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray as Uint8Array<ArrayBuffer>;
}

export async function getActivePushSubscription(): Promise<PushSubscription | null> {
  if (getPushSupportStatus() === 'unsupported') {
    return null;
  }

  const registration = await navigator.serviceWorker.ready;
  return registration.pushManager.getSubscription();
}

export async function subscribeToWebPush(): Promise<PushSubscription> {
  const response = await getPushVapidPublicKey();
  const publicKey = response.data?.public_key ?? '';
  const enabled = response.data?.enabled ?? false;

  if (!enabled || !publicKey) {
    throw new Error('Push notifications are not configured on the server.');
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Notification permission was denied.');
  }

  const registration = await navigator.serviceWorker.ready;
  const existing = await registration.pushManager.getSubscription();

  const subscription =
    existing ??
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey)
    }));

  const json = subscription.toJSON();

  if (!json.endpoint || !json.keys?.['p256dh'] || !json.keys?.['auth']) {
    throw new Error('Invalid push subscription from the browser.');
  }

  await postAccountPushSubscriptions({
    endpoint: json.endpoint,
    keys: {
      p256dh: json.keys['p256dh'],
      auth: json.keys['auth']
    }
  });

  return subscription;
}

export async function unsubscribeFromWebPush(): Promise<void> {
  const subscription = await getActivePushSubscription();

  if (!subscription) {
    return;
  }

  const endpoint = subscription.endpoint;

  await subscription.unsubscribe();
  await deleteAccountPushSubscriptions({ endpoint });
}
