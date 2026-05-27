'use client';
import { IconArrowLeft, IconBasket } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '~/src/components/ui/button';

export function CartNotFound() {
  return (
    <div className='bg-background flex min-h-screen flex-row items-center justify-center px-4'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='text-center'
      >
        <div className='bg-secondary mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full'>
          <IconBasket className='text-muted-foreground h-10 w-10' />
        </div>
        <h1 className='mb-2 text-3xl font-bold'>Your Cart is empty </h1>
        <p className='text-muted-foreground mb-6 max-w-md'>
          Add some items to your cart before checking out.
        </p>
        <div className='flex items-center justify-center gap-3'>
          <Button asChild variant='outline' className='gap-2 py-4'>
            <Link href='/shop'>
              <IconArrowLeft className='h-4 w-4' />
              Go Shopping
            </Link>
          </Button>
          <Button asChild>
            <Link href='/'>Go Home</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
