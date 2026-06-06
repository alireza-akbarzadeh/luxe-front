import {
  IconAdjustmentsDollar,
  IconCreditCard,
  IconReceipt,
  IconTag,
  IconTruck
} from '@tabler/icons-react';
import * as React from 'react';

import { PaymentBadge } from '@/domains/orders/components/order-statuses-badge';
import type { PaymentStatus } from '@/domains/orders/orders-types';

// 1. Define the interface shape mapping for the order summary payload
export interface PaymentSummaryOrderDetails {
  currency?: string | null;
  subtotal: number;
  discount: number;
  shipping_cost: number;
  tax: number;
  total: number;
  payment_method?: string | null;
  payment_status: PaymentStatus | string;
}

export interface OrderPaymentSummaryProps {
  order: PaymentSummaryOrderDetails;
}

// 2. Structurally map the internal list loop schema layout
interface SummaryRowItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  neg?: boolean;
}

export function OrderPaymentSummary({ order }: OrderPaymentSummaryProps) {
  // ISO-safe currency formatting engine mapping dynamically to back-end currencies
  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: order.currency || 'USD'
    }).format(n || 0);

  // 3. Statically construct row matrix models with clean types
  const rows: SummaryRowItem[] = [
    { label: 'Subtotal', icon: IconAdjustmentsDollar, value: fmt(order.subtotal) },
    {
      label: 'Discount',
      icon: IconTag,
      value: order.discount > 0 ? `-${fmt(order.discount)}` : '—',
      neg: order.discount > 0
    },
    {
      label: 'Shipping',
      icon: IconTruck,
      value: order.shipping_cost > 0 ? fmt(order.shipping_cost) : 'Free'
    },
    { label: 'Tax', icon: IconReceipt, value: fmt(order.tax) }
  ];

  return (
    <div className='bg-card border-border/40 overflow-hidden rounded-2xl border shadow-sm'>
      <div className='bg-muted/20 border-border/10 border-b px-6 py-4'>
        <h2 className='text-muted-foreground text-[10px] font-black tracking-widest uppercase'>
          Payment Summary
        </h2>
      </div>
      <div className='space-y-3 p-6'>
        {/* Render Summary Breakdowns */}
        {rows.map(({ label, icon: Icon, value, neg }) => (
          <div key={label} className='flex items-center justify-between'>
            <div className='text-muted-foreground flex items-center gap-2 text-xs font-medium'>
              <Icon className='text-muted-foreground/70 h-3.5 w-3.5' />
              {label}
            </div>
            <span
              className={`text-foreground text-xs font-semibold tabular-nums ${
                neg ? 'text-emerald-600 dark:text-emerald-400' : ''
              }`}
            >
              {value}
            </span>
          </div>
        ))}

        {/* Total Metric Block */}
        <div className='border-border/10 mt-2 flex items-center justify-between border-t pt-4'>
          <span className='text-foreground text-sm font-black tracking-wide uppercase'>Total</span>
          <span className='text-foreground text-xl font-black tabular-nums'>
            {fmt(order.total)}
          </span>
        </div>

        {/* Transaction Meta Card Sub-section */}
        <div className='bg-muted/40 border-border/5 mt-4 space-y-3 rounded-xl border p-4'>
          <div className='flex items-center justify-between'>
            <div className='text-muted-foreground flex items-center gap-2 text-xs font-medium'>
              <IconCreditCard className='text-muted-foreground/70 h-3.5 w-3.5' />
              Method
            </div>
            <span className='text-foreground text-xs font-bold'>{order.payment_method || '—'}</span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-muted-foreground text-xs font-medium'>Status</span>
            <PaymentBadge status={order.payment_status} size='sm' />
          </div>
        </div>
      </div>
    </div>
  );
}
