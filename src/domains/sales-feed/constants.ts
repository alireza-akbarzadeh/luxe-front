import type { SaleEventType } from './sales-store';

export const SALES_FEED_STATUS_KEYS = [
  'pending',
  'paid',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
  'delayed'
] as const;

export type SalesFeedStatusKey = (typeof SALES_FEED_STATUS_KEYS)[number];

export const STATUS_COLORS: Record<SalesFeedStatusKey, string> = {
  pending: '#f59e0b',
  paid: '#22c55e',
  shipped: '#06b6d4',
  delivered: '#16a34a',
  cancelled: '#ef4444',
  refunded: '#ec4899',
  delayed: '#f97316'
};

export const EVENT_TYPE_META: Record<
  SaleEventType,
  { label: string; color: string; bg: string }
> = {
  new_order: { label: 'New Order', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  status_change: { label: 'Status', color: 'text-blue-600', bg: 'bg-blue-50' },
  payment: { label: 'Payment', color: 'text-violet-600', bg: 'bg-violet-50' },
  cancellation: { label: 'Cancelled', color: 'text-red-600', bg: 'bg-red-50' },
  refund: { label: 'Refund', color: 'text-pink-600', bg: 'bg-pink-50' },
  shipment: { label: 'Shipped', color: 'text-cyan-600', bg: 'bg-cyan-50' }
};

export function formatStatusLabel(status: string): string {
  if (!status) return 'Unknown';
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function normalizeStatusKey(status: string): SalesFeedStatusKey | null {
  const key = status.toLowerCase() as SalesFeedStatusKey;
  return SALES_FEED_STATUS_KEYS.includes(key) ? key : null;
}
