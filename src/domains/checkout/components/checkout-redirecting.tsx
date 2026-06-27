'use client';

import { IconLoader2 } from '@tabler/icons-react';
import { motion } from 'framer-motion';

import { useCheckoutStore } from '../store/checkout.store';

interface CheckoutRedirectingScreenProps {
  isPlacing?: boolean;
}

/** Shown while placing an order or navigating to Stripe / confirmation. */
export function CheckoutRedirectingScreen({ isPlacing = false }: CheckoutRedirectingScreenProps) {
  const redirectMode = useCheckoutStore((s) => s.redirectMode);
  const isStripePayment = redirectMode === 'payment';

  const title = isPlacing
    ? 'Placing your order…'
    : isStripePayment
      ? 'Redirecting to secure payment…'
      : 'Order placed!';

  const description = isPlacing
    ? 'Please wait — do not close this page.'
    : isStripePayment
      ? 'You will complete checkout on Stripe.'
      : 'Taking you to your order confirmation…';

  return (
    <div className='bg-background fixed inset-0 z-50 flex items-center justify-center px-4'>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className='text-center'
        role='status'
        aria-live='polite'
      >
        <IconLoader2 className='text-accent mx-auto mb-4 h-10 w-10 animate-spin' />
        <h2 className='text-lg font-semibold'>{title}</h2>
        <p className='text-muted-foreground mt-1 text-sm'>{description}</p>
      </motion.div>
    </div>
  );
}
