'use client';

import { IconArrowLeft, IconBuildingStore } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function StoreNotFound() {
  return (
    <div className='bg-background flex min-h-screen items-center justify-center px-4'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='text-center'
      >
        <div className='bg-secondary mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full'>
          <IconBuildingStore className='text-muted-foreground h-10 w-10' />
        </div>
        <h1 className='mb-2 text-3xl font-bold'>Store Not Found</h1>
        <p className='text-muted-foreground mb-6 max-w-md'>
          The store you&apos;re looking for doesn&apos;t exist or may have been removed.
        </p>
        <div className='flex items-center justify-center gap-3'>
          <Link href='/store'>
            <Button variant='outline' className='gap-2'>
              <IconArrowLeft className='h-4 w-4' />
              Browse Stores
            </Button>
          </Link>
          <Link href='/'>
            <Button>Go Home</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
