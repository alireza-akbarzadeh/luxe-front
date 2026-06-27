'use client';

import { IconLoader2 } from '@tabler/icons-react';
import { motion } from 'framer-motion';

import { useCheckoutStore } from '../store/checkout.store';

/** Shown after checkout while navigating to Stripe or the confirmation page. */
export function CheckoutRedirectingScreen() {
  const redirectMode = useCheckoutStore((s) => s.redirectMode);
  const isStripePayment = redirectMode === 'payment';

  return (
    <div className='flex min-h-[60vh] items-center justify-center px-4 pt-24 pb-16'>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className='text-center'
        role='status'
        aria-live='polite'
      >
        <IconLoader2 className='text-accent mx-auto mb-4 h-10 w-10 animate-spin' />
        <h2 className='text-lg font-semibold'>
          {isStripePayment ? 'Redirecting to secure payment…' : 'Order placed!'}
        </h2>
        <p className='text-muted-foreground mt-1 text-sm'>
          {isStripePayment
            ? 'You will complete checkout on Stripe.'
            : 'Taking you to your order confirmation…'}
        </p>
      </motion.div>
    </div>
  );
}
