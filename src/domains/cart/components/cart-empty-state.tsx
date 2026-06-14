'use client';

import { IconArrowRight, IconShoppingBag } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export function CartEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className='rounded-3xl border border-dashed bg-muted/20 px-6 py-16 text-center'
    >
      <div className='bg-secondary mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full'>
        <IconShoppingBag className='text-muted-foreground h-8 w-8' />
      </div>
      <h2 className='font-display mb-2 text-xl font-semibold'>Your cart is empty</h2>
      <p className='text-muted-foreground mx-auto mb-6 max-w-sm text-sm'>
        Discover curated pieces designed to last — start building your collection.
      </p>
      <Button asChild className='rounded-full' size='lg'>
        <Link href='/shop'>
          Explore the shop
          <IconArrowRight className='ml-2 h-4 w-4' />
        </Link>
      </Button>
    </motion.div>
  );
}
