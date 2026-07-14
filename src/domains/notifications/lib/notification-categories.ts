import type { Icon } from '@tabler/icons-react';
import {
  IconBell,
  IconHeart,
  IconPackage,
  IconSettings,
  IconTag,
  IconTicket,
  IconTruck,
  IconUser
} from '@tabler/icons-react';

import type { AccountNotification } from '@/domains/account/api/account-notifications-api';

export const NOTIFICATION_CATEGORIES = [
  'all',
  'orders',
  'coupons',
  'offers',
  'shipping',
  'wishlist',
  'account',
  'system'
] as const;

export type NotificationCategory = (typeof NOTIFICATION_CATEGORIES)[number];

export type NotificationReadFilter = 'all' | 'unread' | 'read';

export interface NotificationCategoryConfig {
  id: NotificationCategory;
  icon: Icon;
}

export const NOTIFICATION_CATEGORY_CONFIG: NotificationCategoryConfig[] = [
  { id: 'all', icon: IconBell },
  { id: 'orders', icon: IconPackage },
  { id: 'coupons', icon: IconTicket },
  { id: 'offers', icon: IconTag },
  { id: 'shipping', icon: IconTruck },
  { id: 'wishlist', icon: IconHeart },
  { id: 'account', icon: IconUser },
  { id: 'system', icon: IconSettings }
];

const ORDER_TYPES = new Set([
  'order_update',
  'order_status_update',
  'order_paid',
  'order_shipped',
  'order_refunded',
  'order_cancelled',
  'payment_success',
  'payment_failed',
  'payment_succeeded'
]);

const COUPON_TYPES = new Set(['coupon', 'coupon_available', 'promo_code']);

const OFFER_TYPES = new Set(['offer', 'special_offer', 'sale', 'promotion']);

const SHIPPING_TYPES = new Set([
  'shipment_update',
  'order_shipped',
  'shipping_update',
  'delivery_update',
  'out_for_delivery'
]);

const WISHLIST_TYPES = new Set(['back_in_stock', 'wishlist_sale', 'price_drop', 'wishlist_update']);

const ACCOUNT_TYPES = new Set([
  'membership_activated',
  'wallet_deposit',
  'gift_card_sent',
  'gift_card_received',
  'gift_card_transferred',
  'account_update',
  'password_changed',
  'security_alert'
]);

const SYSTEM_TYPES = new Set([
  'system',
  'announcement',
  'low_stock_alert',
  'vendor_order_update',
  'vendor_notification',
  'update'
]);

/** Maps backend notification type strings to inbox category tabs. */
export function getNotificationCategory(type?: string): NotificationCategory {
  const normalized = (type ?? 'update').toLowerCase();

  if (
    ORDER_TYPES.has(normalized) ||
    normalized.includes('order') ||
    normalized.includes('payment')
  ) {
    return 'orders';
  }
  if (
    COUPON_TYPES.has(normalized) ||
    normalized.includes('coupon') ||
    normalized.includes('promo')
  ) {
    return 'coupons';
  }
  if (OFFER_TYPES.has(normalized) || normalized.includes('offer') || normalized.includes('sale')) {
    return 'offers';
  }
  if (
    SHIPPING_TYPES.has(normalized) ||
    normalized.includes('ship') ||
    normalized.includes('delivery') ||
    normalized === 'back_in_stock'
  ) {
    return 'shipping';
  }
  if (
    WISHLIST_TYPES.has(normalized) ||
    normalized.includes('wishlist') ||
    normalized.includes('price_drop')
  ) {
    return 'wishlist';
  }
  if (
    ACCOUNT_TYPES.has(normalized) ||
    normalized.includes('membership') ||
    normalized.includes('wallet') ||
    normalized.includes('gift_card') ||
    normalized.includes('password') ||
    normalized.includes('account')
  ) {
    return 'account';
  }
  if (
    SYSTEM_TYPES.has(normalized) ||
    normalized.includes('vendor') ||
    normalized.includes('system')
  ) {
    return 'system';
  }

  return 'system';
}

export function filterNotificationsByCategory(
  notifications: AccountNotification[],
  category: NotificationCategory
): AccountNotification[] {
  if (category === 'all') return notifications;
  return notifications.filter((item) => getNotificationCategory(item.type) === category);
}

export function filterNotificationsByReadState(
  notifications: AccountNotification[],
  readFilter: NotificationReadFilter
): AccountNotification[] {
  if (readFilter === 'unread') return notifications.filter((item) => !item.is_read);
  if (readFilter === 'read') return notifications.filter((item) => item.is_read);
  return notifications;
}

export function countNotificationsByCategory(
  notifications: AccountNotification[]
): Record<NotificationCategory, number> {
  const counts = Object.fromEntries(
    NOTIFICATION_CATEGORIES.map((category) => [category, 0])
  ) as Record<NotificationCategory, number>;

  counts.all = notifications.length;

  for (const notification of notifications) {
    const category = getNotificationCategory(notification.type);
    counts[category] += 1;
  }

  return counts;
}

export function getCategoryIcon(category: NotificationCategory): Icon {
  return NOTIFICATION_CATEGORY_CONFIG.find((item) => item.id === category)?.icon ?? IconBell;
}
