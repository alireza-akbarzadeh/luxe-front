'use client';

import { IconArrowRight, IconChevronRight, IconHeart } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { DynamicBreadcrumb } from '~/src/components/breadcrumb-list';

export function WishlistGuestState() {
  return (
    <main className='app-container pt-24 pb-16'>
      <DynamicBreadcrumb
        items={[{ label: 'My Wishlist' }]}
        direction='column'
        separator={<IconChevronRight className='h-3 w-3' />}
        className='text-muted-foreground mb-8 text-xs'
        breadcrumbClassName='flex items-center gap-1.5'
      />

      <div className='mx-auto max-w-lg'>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-card rounded-3xl border p-8 text-center shadow-sm sm:p-12'
        >
          <div className='bg-secondary mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full'>
            <IconHeart className='text-muted-foreground h-9 w-9' />
          </div>
          <h1 className='font-display mb-2 text-2xl font-semibold sm:text-3xl'>
            Sign in to view your wishlist
          </h1>
          <p className='text-muted-foreground mb-8 text-sm leading-relaxed'>
            Save favorites across devices and move items to cart when you&apos;re ready. Your
            wishlist is personal — separate from our curated collections.
          </p>
          <div className='flex flex-col gap-3 sm:flex-row sm:justify-center'>
            <Button asChild className='rounded-full' size='lg'>
              <Link href='/login?callbackUrl=/wishlist'>
                Sign in
                <IconArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
            <Button asChild variant='outline' className='rounded-full' size='lg'>
              <Link href='/shop'>Browse shop</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
