'use client';

import { IconArrowLeft, IconHome, IconReceiptOff } from '@tabler/icons-react';
import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 130, damping: 18 }
  }
};

export default function OrderNotFound() {
  return (
    <main className='relative flex min-h-[60vh] flex-1 items-center justify-center overflow-hidden px-4'>
      <motion.div
        aria-hidden
        className='bg-primary/10 pointer-events-none absolute top-1/4 -left-16 h-48 w-48 rounded-full blur-3xl'
        animate={{ x: [0, 20, 0], y: [0, -16, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className='bg-amber-200/20 pointer-events-none absolute -right-10 bottom-1/4 h-36 w-36 rounded-full blur-2xl'
        animate={{ x: [0, -14, 0], y: [0, 12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
      />

      <motion.div
        variants={containerVariants}
        initial='hidden'
        animate='visible'
        className='relative max-w-md text-center'
      >
        <motion.div
          variants={itemVariants}
          className='bg-muted/40 border-border/40 relative mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl border shadow-sm'
        >
          <motion.div
            className='absolute inset-0 rounded-2xl border border-dashed border-amber-500/30'
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            animate={{ y: [0, -4, 0], rotate: [0, -3, 3, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <IconReceiptOff className='text-muted-foreground/80 h-10 w-10' />
          </motion.div>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className='text-primary mb-2 text-[10px] font-bold tracking-[0.3em] uppercase'
        >
          Order missing
        </motion.p>

        <motion.h1
          variants={itemVariants}
          className='text-foreground mb-3 text-2xl font-black tracking-tight uppercase sm:text-3xl'
        >
          Order Not Found
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className='text-muted-foreground mx-auto mb-8 max-w-sm text-xs leading-relaxed font-medium sm:text-sm'
        >
          Sorry, we couldn&apos;t find the order you&apos;re looking for. The order ID might be
          incorrect, or it may have been permanently archived.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className='flex flex-col justify-center gap-3 sm:flex-row'
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              asChild
              variant='outline'
              className='border-border/60 bg-background h-11 gap-2 rounded-xl px-5 text-[11px] font-bold tracking-wider uppercase'
            >
              <Link href='/dashboard/orders'>
                <IconArrowLeft className='h-4 w-4' />
                Back to Orders
              </Link>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              asChild
              className='h-11 gap-2 rounded-xl px-5 text-[11px] font-bold tracking-wider uppercase'
            >
              <Link href='/dashboard'>
                <IconHome className='h-4 w-4' />
                Dashboard Home
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </main>
  );
}
