'use client';

import { IconCreditCard } from '@tabler/icons-react';
import { motion } from 'framer-motion';

import { cartMoneyClassName, formatCartMoney } from '@/domains/cart/lib/cart-utils';
import { OrderStatus } from '@/lib/constants/enum-statuses';
import { cn } from '@/lib/utils';
import type { ModelsPayment } from '~/src/services/-checkout-post.schemas';

interface PaymentDetailsProps {
  payment: ModelsPayment | undefined;
  currentStatus: string;
  highlight?: boolean;
}

function getPaymentStatusClass(status?: string) {
  switch (status) {
    case 'succeeded':
    case 'completed':
      return 'text-green-600';
    case 'failed':
      return 'text-red-600';
    default:
      return 'text-amber-600';
  }
}

export function PaymentDetails({ payment, currentStatus, highlight }: PaymentDetailsProps) {
  return (
    <motion.div
      layout
      animate={
        highlight
          ? {
              boxShadow: [
                '0 0 0 0 rgba(34,197,94,0)',
                '0 0 0 4px rgba(34,197,94,0.12)',
                '0 0 0 0 rgba(34,197,94,0)'
              ]
            }
          : undefined
      }
      transition={{ duration: 1.2 }}
      whileHover={{ y: -2 }}
      className='bg-card border-border/50 rounded-2xl border p-5 transition-shadow hover:shadow-md'
    >
      <div className='mb-3 flex items-center gap-2'>
        <IconCreditCard className='text-accent h-5 w-5' />
        <h3 className='font-semibold'>Payment information</h3>
      </div>

      {payment ? (
        <div className='space-y-2 text-sm'>
          <div className='flex justify-between gap-4'>
            <span className='text-muted-foreground'>Method</span>
            <span className='font-medium capitalize'>
              {payment.method?.replace(/_/g, ' ') ?? '—'}
            </span>
          </div>
          <div className='flex justify-between gap-4'>
            <span className='text-muted-foreground'>Status</span>
            <motion.span
              className={cn('font-medium capitalize', getPaymentStatusClass(payment.status))}
              animate={
                payment.status === 'pending' && currentStatus !== OrderStatus.Pending
                  ? { scale: [1, 1.05, 1] }
                  : {}
              }
              transition={{ duration: 0.35 }}
            >
              {payment.status ?? 'pending'}
            </motion.span>
          </div>
          {payment.transaction_id && payment.transaction_id !== 'pending' && (
            <div className='flex justify-between gap-4'>
              <span className='text-muted-foreground'>Transaction ID</span>
              <span className='max-w-[55%] truncate font-mono text-xs'>
                {payment.transaction_id}
              </span>
            </div>
          )}
          <div className='border-border mt-1 flex justify-between gap-4 border-t pt-2'>
            <span className='text-muted-foreground'>Amount paid</span>
            <span className={cn('font-bold', cartMoneyClassName)}>
              {formatCartMoney(payment.amount)} {payment.currency}
            </span>
          </div>
        </div>
      ) : (
        <p className='text-muted-foreground text-sm'>
          Payment details will appear after confirmation.
        </p>
      )}
    </motion.div>
  );
}
