'use client';

import { IconReceipt } from '@tabler/icons-react';
import { motion } from 'framer-motion';

import { cartMoneyClassName, formatCartMoney } from '@/domains/cart/lib/cart-utils';
import { cn } from '@/lib/utils';

interface OrderTrackingSummaryProps {
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  currency: string;
}

export function OrderTrackingSummary({
  currency,
  shippingCost,
  subtotal,
  tax,
  total
}: OrderTrackingSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.35 }}
    >
      <div className='bg-card border-border/50 rounded-2xl border p-6'>
        <h2 className='mb-4 flex items-center gap-2 text-lg font-semibold'>
          <IconReceipt className='h-5 w-5' />
          Order summary
        </h2>
        <div className={cn('space-y-3 text-sm', cartMoneyClassName)}>
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>Subtotal</span>
            <span>{formatCartMoney(subtotal)}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>Shipping</span>
            <span>{shippingCost === 0 ? 'Free' : formatCartMoney(shippingCost)}</span>
          </div>
          {tax > 0 && (
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Tax</span>
              <span>{formatCartMoney(tax)}</span>
            </div>
          )}
          <div className='border-border mt-3 border-t pt-3'>
            <div className='flex justify-between font-bold'>
              <span>Total</span>
              <span>{formatCartMoney(total)}</span>
            </div>
            {currency ? (
              <p className='text-muted-foreground mt-1 text-right text-xs uppercase'>{currency}</p>
            ) : null}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
