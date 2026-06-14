// components/checkout-summary.tsx
'use client';

import { IconLock, IconShieldCheck } from '@tabler/icons-react';
import { useStore } from '@tanstack/react-form';
import { motion } from 'framer-motion';
import Image from 'next/image';

import { withForm } from '@/components/forms/useAppForm';
import { Separator } from '@/components/ui/separator';
import { formatEstimatedTaxLabel } from '@/domains/cart/lib/cart-commerce-settings';
import { cartMoneyClassName, formatCartMoney } from '@/domains/cart/lib/cart-utils';
import { checkoutDefaultValues } from '@/domains/checkout/checkout.schema';
import { useCartController } from '@/hooks/useCartController';
import { cn } from '@/lib/utils';

import { useCheckoutTotals } from '../hooks/useCartTotal';

export const CheckoutSummary = withForm({
  defaultValues: checkoutDefaultValues,
  render: function SummaryRender({ form }) {
    const { items } = useCartController();

    const shippingProviderId = useStore(form.store, (s) => s.values.shippingProviderId);

    const { subtotal, shippingPrice, tax, couponDiscount, appliedCouponCode, total, settings } =
      useCheckoutTotals(shippingProviderId);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className='bg-card border-border/50 sticky top-24 rounded-2xl border p-6'
      >
        <h2 className='mb-4 text-lg font-semibold'>Order Summary</h2>
        <div className='mb-4 max-h-64 space-y-3 overflow-y-auto'>
          {items.map((item) => (
            <div key={`${item.id}-${item.color}-${item.size}`} className='flex items-center gap-3'>
              <div className='bg-muted relative h-14 w-14 shrink-0 overflow-hidden rounded-xl'>
                <Image src={item.image || ''} alt={item.name || ''} fill className='object-cover' />
                <span className='bg-accent text-accent-foreground absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs'>
                  {item.quantity}
                </span>
              </div>
              <div className='min-w-0 flex-1'>
                <p className='truncate text-sm font-medium'>{item.name}</p>
                {(item.color || item.size) && (
                  <p className='text-muted-foreground text-xs'>
                    {item.color && `${item.color}`}
                    {item.color && item.size && ' / '}
                    {item.size && `${item.size}`}
                  </p>
                )}
              </div>
              <p className={cn(cartMoneyClassName, 'text-sm font-medium')}>
                {formatCartMoney((item.price ?? 0) * (item.quantity ?? 0))}
              </p>
            </div>
          ))}
        </div>
        <Separator className='my-4' />
        <div className='space-y-2 text-sm'>
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>Subtotal</span>
            <span className={cartMoneyClassName}>{formatCartMoney(subtotal)}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>Shipping</span>
            <span className={cartMoneyClassName}>
              {shippingPrice === 0 ? (
                <span className='text-green-600'>Free</span>
              ) : (
                formatCartMoney(shippingPrice)
              )}
            </span>
          </div>
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>
              {settings.estimatedTaxEnabled
                ? `Est. tax (${formatEstimatedTaxLabel(settings.estimatedTaxRate)})`
                : 'Tax'}
            </span>
            <span className={cartMoneyClassName}>{formatCartMoney(tax)}</span>
          </div>
          {couponDiscount > 0 && (
            <div className='flex justify-between text-green-600'>
              <span>Coupon Discount{appliedCouponCode ? ` (${appliedCouponCode})` : ''}</span>
              <span className={cartMoneyClassName}>−{formatCartMoney(couponDiscount)}</span>
            </div>
          )}
        </div>
        <Separator className='my-4' />
        <div className='flex items-center justify-between'>
          <span className='font-semibold'>Total</span>
          <span className={cn(cartMoneyClassName, 'text-2xl font-bold')}>
            {formatCartMoney(total)}
          </span>
        </div>
        <div className='border-border mt-6 flex items-center justify-center gap-4 border-t pt-4'>
          <div className='text-muted-foreground flex items-center gap-1 text-xs'>
            <IconShieldCheck className='h-4 w-4' />
            Secure Checkout
          </div>
          <div className='text-muted-foreground flex items-center gap-1 text-xs'>
            <IconLock className='h-4 w-4' />
            Encrypted
          </div>
        </div>
      </motion.div>
    );
  }
});
