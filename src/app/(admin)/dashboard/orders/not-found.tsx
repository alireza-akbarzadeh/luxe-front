'use client';

import { IconArrowLeft, IconHome, IconReceiptOff } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function OrderNotFound() {
  return (
    <main className='flex min-h-[60vh] flex-1 items-center justify-center px-4'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='max-w-md text-center'
      >
        <div className='bg-muted/40 border-border/40 mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl border shadow-sm'>
          <IconReceiptOff className='text-muted-foreground/80 h-10 w-10' />
        </div>
        <h1 className='text-foreground mb-3 text-2xl font-black tracking-tight uppercase sm:text-3xl'>
          Order Not Found
        </h1>
        <p className='text-muted-foreground mx-auto mb-8 max-w-sm text-xs leading-relaxed font-medium sm:text-sm'>
          Sorry, we couldn&apos;t find the order you&apos;re looking for. The order ID might be
          incorrect, or it may have been permanently archived.
        </p>
        <div className='flex flex-col justify-center gap-3 sm:flex-row'>
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
          <Button
            asChild
            className='h-11 gap-2 rounded-xl px-5 text-[11px] font-bold tracking-wider uppercase'
          >
            <Link href='/dashboard'>
              <IconHome className='h-4 w-4' />
              Dashboard Home
            </Link>
          </Button>
        </div>
      </motion.div>
    </main>
  );
}
