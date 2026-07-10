import type { DtoOrderItemDetailDTO } from '@/services/-account-orders-get.schemas';

export const ORDER_STATUS_STYLES: Record<string, string> = {
  pending:
    'border-amber-500/25 bg-amber-500/10 text-amber-800 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300',
  paid: 'border-gold/30 bg-gold/15 text-gold-strong dark:border-gold/25 dark:bg-gold/10 dark:text-gold',
  shipped:
    'border-sky-500/25 bg-sky-500/10 text-sky-800 dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-300',
  delivered:
    'border-emerald-500/25 bg-emerald-500/10 text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300',
  cancelled:
    'border-red-500/20 bg-red-500/10 text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300',
  refunded: 'border-border bg-muted/60 text-muted-foreground'
};

export function formatOrderStatus(status?: string): string {
  if (!status) return 'Unknown';
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function getOrderStatusStyle(status?: string): string {
  if (!status) {
    return 'border-border bg-muted/60 text-muted-foreground';
  }
  return ORDER_STATUS_STYLES[status.toLowerCase()] ?? ORDER_STATUS_STYLES['pending']!;
}

export function formatOrderAmount(value?: number | string): string {
  const amount = typeof value === 'string' ? Number(value) : (value ?? 0);
  const safeAmount = Number.isFinite(amount) ? amount : 0;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(safeAmount);
}

export function countAccountOrderItems(items?: DtoOrderItemDetailDTO[]): number {
  if (!items?.length) return 0;
  return items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
}

export function getAccountOrderLineTotal(item: DtoOrderItemDetailDTO): number {
  return (item.price ?? 0) * (item.quantity ?? 0);
}

export function getOrderTrackingHref(orderId?: number): string | null {
  if (!orderId) return null;
  return `/order-tracking/${orderId}`;
}
