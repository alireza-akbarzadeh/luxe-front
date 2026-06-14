import { cn } from '@/lib/utils';

import { formatOrderStatus, getOrderStatusStyle } from '../lib/order-utils';

interface OrderStatusBadgeProps {
  status?: string;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wide capitalize',
        getOrderStatusStyle(status),
        className
      )}
    >
      {formatOrderStatus(status)}
    </span>
  );
}
