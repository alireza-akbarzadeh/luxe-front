import { IconCreditCard } from '@tabler/icons-react';

import { ApiPaymentStatusBadge } from '@/domains/orders/components/order-api-badges';
import { formatCurrency } from '@/lib/format';
import type { DtoAdminOrderDetailResponse } from '@/services/-orders-{id}-get.schemas';

interface OrderPaymentSummaryProps {
  order: DtoAdminOrderDetailResponse;
}

export function OrderPaymentSummary({ order }: OrderPaymentSummaryProps) {
  const currency = order.currency ?? 'USD';

  return (
    <div className='bg-card border-border/40 overflow-hidden rounded-2xl border shadow-sm'>
      <div className='bg-muted/20 border-border/10 border-b px-6 py-4'>
        <h2 className='text-muted-foreground text-[10px] font-black tracking-widest uppercase'>
          Payment
        </h2>
      </div>
      <div className='space-y-4 p-6'>
        <div className='flex items-center justify-between'>
          <span className='text-foreground text-sm font-black tracking-wide uppercase'>Total</span>
          <span className='text-foreground text-xl font-black tabular-nums'>
            {formatCurrency(order.total_amount ?? 0, currency)}
          </span>
        </div>

        <div className='bg-muted/40 border-border/5 space-y-3 rounded-xl border p-4'>
          <div className='flex items-center justify-between'>
            <div className='text-muted-foreground flex items-center gap-2 text-xs font-medium'>
              <IconCreditCard className='text-muted-foreground/70 h-3.5 w-3.5' />
              Method
            </div>
            <span className='text-foreground text-xs font-bold capitalize'>
              {order.payment_method?.replaceAll('_', ' ') || '—'}
            </span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-muted-foreground text-xs font-medium'>Status</span>
            <ApiPaymentStatusBadge status={order.payment_status} size='sm' />
          </div>
        </div>
      </div>
    </div>
  );
}
