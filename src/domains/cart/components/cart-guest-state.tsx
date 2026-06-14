'use client';

import { IconArrowRight, IconShoppingBag } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export function CartGuestState() {
  return (
    <main className='pt-24 pb-16'>
      <div className='mx-auto max-w-lg px-4 sm:px-6'>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-card rounded-3xl border p-8 text-center shadow-sm sm:p-12'
        >
          <div className='bg-secondary mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full'>
            <IconShoppingBag className='text-muted-foreground h-9 w-9' />
          </div>
          <h1 className='font-display mb-2 text-2xl font-semibold sm:text-3xl'>
            Sign in to view your cart
          </h1>
          <p className='text-muted-foreground mb-8 text-sm leading-relaxed'>
            Save items across devices, track orders, and checkout securely with your LUXE account.
          </p>
          <div className='flex flex-col gap-3 sm:flex-row sm:justify-center'>
            <Button asChild className='rounded-full' size='lg'>
              <Link href='/login?callbackUrl=/cart'>
                Sign in
                <IconArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
            <Button asChild variant='outline' className='rounded-full' size='lg'>
              <Link href='/shop'>Continue shopping</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
