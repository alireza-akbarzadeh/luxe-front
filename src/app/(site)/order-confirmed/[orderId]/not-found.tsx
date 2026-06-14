'use client';

import { IconArrowLeft, IconShoppingBag } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function OrderConfirmedNotFound() {
  return (
    <div className='flex min-h-[60vh] items-center justify-center px-4 pt-24 pb-16'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='text-center'
      >
        <h1 className='mb-2 text-2xl font-bold'>Order not found</h1>
        <p className='text-muted-foreground mb-6 max-w-md text-sm'>
          We couldn&apos;t find this order. It may have been removed or the link is invalid.
        </p>
        <div className='flex items-center justify-center gap-3'>
          <Button asChild variant='outline' className='gap-2 rounded-full'>
            <Link href='/shop'>
              <IconShoppingBag className='h-4 w-4' />
              Continue shopping
            </Link>
          </Button>
          <Button asChild variant='link' className='gap-2'>
            <Link href='/'>
              <IconArrowLeft className='h-4 w-4' />
              Go home
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
