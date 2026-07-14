import type { Icon } from '@tabler/icons-react';
import {
  IconBell,
  IconHeart,
  IconPackage,
  IconSettings,
  IconTag,
  IconTicket,
  IconTruck,
  IconUser,
  IconWallet
} from '@tabler/icons-react';
import { formatDistanceToNow, parseISO } from 'date-fns';

import {
  getNotificationCategory,
  type NotificationCategory
} from '@/domains/notifications/lib/notification-categories';

import type { AccountNotification } from '../api/account-notifications-api';

export const NOTIFICATION_TYPE_STYLES: Record<string, string> = {
  order_update:
    'border-sky-500/25 bg-sky-500/10 text-sky-800 dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-300',
  order_status_update:
    'border-sky-500/25 bg-sky-500/10 text-sky-800 dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-300',
  order_shipped:
    'border-emerald-500/25 bg-emerald-500/10 text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300',
  payment_success:
    'border-emerald-500/25 bg-emerald-500/10 text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300',
  payment_succeeded:
    'border-emerald-500/25 bg-emerald-500/10 text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300',
  membership_activated:
    'border-violet-500/25 bg-violet-500/10 text-violet-800 dark:border-violet-400/20 dark:bg-violet-400/10 dark:text-violet-300',
  wallet_deposit:
    'border-emerald-500/25 bg-emerald-500/10 text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300',
  payment_failed:
    'border-red-500/20 bg-red-500/10 text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300',
  shipment_update:
    'border-amber-500/25 bg-amber-500/10 text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300',
  back_in_stock:
    'border-pink-500/25 bg-pink-500/10 text-pink-800 dark:border-pink-400/20 dark:bg-pink-400/10 dark:text-pink-300',
  coupon:
    'border-purple-500/25 bg-purple-500/10 text-purple-800 dark:border-purple-400/20 dark:bg-purple-400/10 dark:text-purple-300',
  offer:
    'border-orange-500/25 bg-orange-500/10 text-orange-800 dark:border-orange-400/20 dark:bg-orange-400/10 dark:text-orange-300'
};

export const NOTIFICATION_CATEGORY_CARD_STYLES: Record<
  NotificationCategory,
  { icon: Icon; iconWrap: string; label: string }
> = {
  all: {
    icon: IconBell,
    iconWrap: 'bg-gold/15 text-gold-strong border-gold/25',
    label: 'text-gold-strong'
  },
  orders: {
    icon: IconPackage,
    iconWrap: 'bg-sky-500/15 text-sky-600 border-sky-500/25 dark:text-sky-300',
    label: 'text-sky-600 dark:text-sky-300'
  },
  coupons: {
    icon: IconTicket,
    iconWrap: 'bg-purple-500/15 text-purple-600 border-purple-500/25 dark:text-purple-300',
    label: 'text-purple-600 dark:text-purple-300'
  },
  offers: {
    icon: IconTag,
    iconWrap: 'bg-orange-500/15 text-orange-600 border-orange-500/25 dark:text-orange-300',
    label: 'text-orange-600 dark:text-orange-300'
  },
  shipping: {
    icon: IconTruck,
    iconWrap: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/25 dark:text-emerald-300',
    label: 'text-emerald-600 dark:text-emerald-300'
  },
  wishlist: {
    icon: IconHeart,
    iconWrap: 'bg-pink-500/15 text-pink-600 border-pink-500/25 dark:text-pink-300',
    label: 'text-pink-600 dark:text-pink-300'
  },
  account: {
    icon: IconUser,
    iconWrap: 'bg-teal-500/15 text-teal-600 border-teal-500/25 dark:text-teal-300',
    label: 'text-teal-600 dark:text-teal-300'
  },
  system: {
    icon: IconSettings,
    iconWrap: 'bg-muted text-muted-foreground border-border',
    label: 'text-muted-foreground'
  }
};

export function getNotificationCardStyle(type?: string) {
  const category = getNotificationCategory(type);
  const styles = NOTIFICATION_CATEGORY_CARD_STYLES[category];

  if (type?.includes('wallet')) {
    return { ...styles, icon: IconWallet };
  }

  return styles;
}

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
