'use client';

import { IconArrowLeft, IconHome, IconPackageExport } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function ProductNotFound() {
  return (
    <main className='flex flex-1 items-center justify-center px-4'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='max-w-md text-center'
      >
        <div className='bg-secondary mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full'>
          <IconPackageExport className='text-muted-foreground h-10 w-10' />
        </div>
        <h1 className='mb-3 text-3xl font-bold'>Product Not Found</h1>
        <p className='text-muted-foreground mb-8'>
          Sorry, we couldn&apos;t find the product you&apos;re looking for. It may have been removed
          or the link might be incorrect.
        </p>
        <div className='flex flex-col justify-center gap-4 sm:flex-row'>
          <Button asChild variant='outline' className='gap-2'>
            <Link href='/shop'>
              <IconArrowLeft className='h-4 w-4' />
              Back to Shop
            </Link>
          </Button>
          <Button asChild className='gap-2'>
            <Link href='/'>
              <IconHome className='h-4 w-4' />
              Go Home
            </Link>
          </Button>
        </div>
      </motion.div>
    </main>
  );
}
