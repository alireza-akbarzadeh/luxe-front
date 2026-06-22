'use client';

import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

import { getOrderStatusStyle } from '../lib/order-utils';

interface OrderStatusBadgeProps {
  status?: string;
  className?: string;
}

const KNOWN_STATUSES = [
  'pending',
  'paid',
  'shipped',
  'delivered',
  'cancelled',
  'refunded'
] as const;

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const t = useTranslations('account.orderStatus');
  const normalized = status?.toLowerCase() ?? 'unknown';
  const label = KNOWN_STATUSES.includes(normalized as (typeof KNOWN_STATUSES)[number])
    ? t(normalized as (typeof KNOWN_STATUSES)[number])
    : t('unknown');

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wide',
        getOrderStatusStyle(status),
        className
      )}
    >
      {label}
    </span>
  );
}
