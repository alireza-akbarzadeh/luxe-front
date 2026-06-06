import type {
  BadgeSize,
  OrderStatus,
  PaymentStatus,
  PriorityLevel
} from '@/domains/orders/orders-types';
import { cn } from '@/lib/utils';

interface BadgeConfig {
  color: string;
  dot: string;
}

interface PriorityConfig {
  color: string;
}

// 1. Explicitly type mapping keys using strict domain definitions
const STATUS_CONFIG: Record<OrderStatus, BadgeConfig> = {
  Pending: {
    color:
      'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-400 dark:border-violet-900/30',
    dot: 'bg-violet-500'
  },
  Processing: {
    color:
      'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/30',
    dot: 'bg-amber-500'
  },
  Fulfilled: {
    color:
      'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-900/30',
    dot: 'bg-sky-500'
  },
  Shipped: {
    color:
      'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/30',
    dot: 'bg-blue-500'
  },
  Delivered: {
    color:
      'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/30',
    dot: 'bg-emerald-500'
  },
  Cancelled: {
    color:
      'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/30',
    dot: 'bg-red-500'
  },
  Refunded: {
    color:
      'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700/50',
    dot: 'bg-gray-400'
  }
};

const PAYMENT_CONFIG: Record<PaymentStatus, BadgeConfig> = {
  Paid: {
    color:
      'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/30',
    dot: 'bg-emerald-500'
  },
  Unpaid: {
    color:
      'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/30',
    dot: 'bg-red-500'
  },
  Refunded: {
    color:
      'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700/50',
    dot: 'bg-gray-400'
  },
  Partial: {
    color:
      'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/30',
    dot: 'bg-amber-500'
  }
};

const PRIORITY_CONFIG: Record<PriorityLevel, PriorityConfig> = {
  Low: {
    color:
      'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700/50'
  },
  Normal: {
    color:
      'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/30'
  },
  High: {
    color:
      'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-900/30'
  },
  Urgent: {
    color:
      'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/30'
  }
};

interface OrderStatusBadgeProps {
  status: OrderStatus | string; // 2. Allow fallback values from loose API endpoints
  size?: BadgeSize;
}

interface PaymentBadgeProps {
  status: PaymentStatus | string;
  size?: BadgeSize;
}

interface PriorityBadgeProps {
  priority: PriorityLevel | string;
}

export function OrderStatusBadge({ status, size = 'sm' }: OrderStatusBadgeProps) {
  // 3. Fallback safely during runtime execution if status is missing or malformed
  const currentStatus = (STATUS_CONFIG[status as OrderStatus] ? status : 'Pending') as OrderStatus;
  const config = STATUS_CONFIG[currentStatus];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-bold tracking-wider uppercase transition-all',
        size === 'sm' ? 'px-2.5 py-0.5 text-[9px]' : 'px-3 py-1 text-[10px]',
        config.color
      )}
    >
      <span className={cn('animate-pulse-slow h-1.5 w-1.5 rounded-full', config.dot)} />
      {currentStatus}
    </span>
  );
}

export function PaymentBadge({ status, size = 'sm' }: PaymentBadgeProps) {
  const currentStatus = (
    PAYMENT_CONFIG[status as PaymentStatus] ? status : 'Unpaid'
  ) as PaymentStatus;
  const config = PAYMENT_CONFIG[currentStatus];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-bold tracking-wider uppercase transition-all',
        size === 'sm' ? 'px-2.5 py-0.5 text-[9px]' : 'px-3 py-1 text-[10px]',
        config.color
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} />
      {currentStatus}
    </span>
  );
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const currentPriority = (
    PRIORITY_CONFIG[priority as PriorityLevel] ? priority : 'Normal'
  ) as PriorityLevel;
  const config = PRIORITY_CONFIG[currentPriority];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[9px] font-black tracking-wider uppercase transition-all',
        config.color
      )}
    >
      {currentPriority}
    </span>
  );
}
