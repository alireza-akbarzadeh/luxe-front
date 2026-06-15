'use client';

import { IconLoader2 } from '@tabler/icons-react';
import { motion } from 'framer-motion';

/** Shown after checkout succeeds while navigating to order tracking. */
export function CheckoutRedirectingScreen() {
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
        <h2 className='text-lg font-semibold'>Order placed!</h2>
        <p className='text-muted-foreground mt-1 text-sm'>Taking you to order tracking…</p>
      </motion.div>
    </div>
  );
}
