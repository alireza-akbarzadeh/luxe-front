'use client';

import { IconLoader2 } from '@tabler/icons-react';
import { motion } from 'framer-motion';

export function CheckoutPlacingOrderOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='bg-background/80 absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl backdrop-blur-sm'
      role='status'
      aria-live='polite'
      aria-label='Placing your order'
    >
      <IconLoader2 className='text-accent mb-3 h-8 w-8 animate-spin' />
      <p className='text-sm font-medium'>Placing your order…</p>
      <p className='text-muted-foreground mt-1 text-xs'>Please don&apos;t close this page.</p>
    </motion.div>
  );
}
