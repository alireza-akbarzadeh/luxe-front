import { formatDistanceToNow, parseISO } from 'date-fns';

import type { AccountNotification } from '../api/account-notifications-api';

export const NOTIFICATION_TYPE_STYLES: Record<string, string> = {
  order_update:
    'border-sky-500/25 bg-sky-500/10 text-sky-800 dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-300',
  payment_success:
    'border-emerald-500/25 bg-emerald-500/10 text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300',
  payment_failed:
    'border-red-500/20 bg-red-500/10 text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300',
  shipment_update:
    'border-amber-500/25 bg-amber-500/10 text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300'
};

export function formatNotificationType(type?: string): string {
  if (!type) return 'Update';
  return type
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function getNotificationTypeStyle(type?: string): string {
  if (!type) {
    return 'border-border bg-muted/60 text-muted-foreground';
  }
  return NOTIFICATION_TYPE_STYLES[type] ?? 'border-gold/25 bg-gold/10 text-gold-strong';
}

export function formatNotificationTime(value?: string): string {
  if (!value) return '—';
  try {
    return formatDistanceToNow(parseISO(value), { addSuffix: true });
  } catch {
    return new Date(value).toLocaleString();
  }
}

export function formatNotificationDate(value?: string): string {
  if (!value) return '—';
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(parseISO(value));
  } catch {
    return new Date(value).toLocaleString();
  }
}

export function countUnreadNotifications(items: AccountNotification[]): number {
  return items.filter((item) => !item.is_read).length;
}
