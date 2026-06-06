import type {
  BadgeSize,
  OrderStatus,
  PaymentStatus,
  PriorityConfig,
  PriorityLevel,
  StatusConfig
} from '@/domains/orders/orders-types';
import { cn } from '@/lib/utils';

// Status configuration with type safety
const STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  Pending: { color: 'bg-violet-100 text-violet-700 border-violet-200', dot: 'bg-violet-500' },
  Processing: { color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  Fulfilled: { color: 'bg-sky-100 text-sky-700 border-sky-200', dot: 'bg-sky-500' },
  Shipped: { color: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  Delivered: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  Cancelled: { color: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' },
  Refunded: { color: 'bg-gray-100 text-gray-600 border-gray-200', dot: 'bg-gray-400' }
};

const PAYMENT_CONFIG: Record<PaymentStatus, StatusConfig> = {
  Paid: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  Unpaid: { color: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' },
  Refunded: { color: 'bg-gray-100 text-gray-600 border-gray-200', dot: 'bg-gray-400' },
  Partial: { color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500' }
};

const PRIORITY_CONFIG: Record<PriorityLevel, PriorityConfig> = {
  Low: { color: 'bg-gray-100 text-gray-600 border-gray-200' },
  Normal: { color: 'bg-blue-100 text-blue-700 border-blue-200' },
  High: { color: 'bg-orange-100 text-orange-700 border-orange-200' },
  Urgent: { color: 'bg-red-100 text-red-700 border-red-200' }
};

// Props interfaces
interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: BadgeSize;
}

interface PaymentBadgeProps {
  status: PaymentStatus;
  size?: BadgeSize;
}

interface PriorityBadgeProps {
  priority: PriorityLevel;
}

export function OrderStatusBadge({ status, size = 'sm' }: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.Pending;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-semibold tracking-wide uppercase',
        size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-xs',
        config.color
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} />
      {status}
    </span>
  );
}

export function PaymentBadge({ status, size = 'sm' }: PaymentBadgeProps) {
  const config = PAYMENT_CONFIG[status] ?? PAYMENT_CONFIG.Unpaid;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-semibold tracking-wide uppercase',
        size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-xs',
        config.color
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} />
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority] ?? PRIORITY_CONFIG.Normal;
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase',
        config.color
      )}
    >
      {priority}
    </span>
  );
}
