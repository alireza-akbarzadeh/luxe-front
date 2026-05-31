'use client';

import { IconAlertCircle, IconHome, IconMail, IconShoppingBag } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className='bg-background flex min-h-screen items-center justify-center px-4 py-12'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full max-w-md'
      >
        <Card className='border-0 shadow-xl'>
          <CardContent className='flex flex-col items-center p-8 text-center'>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              className='bg-muted mb-6 rounded-full p-4'
            >
              <IconAlertCircle size={48} className='text-muted-foreground' />
            </motion.div>
            <h1 className='text-foreground text-6xl font-bold tracking-tight'>404</h1>
            <h2 className='mt-2 text-2xl font-semibold'>Page not found</h2>
            <p className='text-muted-foreground mt-2'>
              Sorry, we couldn’t find the page you’re looking for. It might have been moved or
              deleted.
            </p>
            <div className='mt-8 flex flex-wrap justify-center gap-3'>
              <Button asChild variant='default'>
                <Link href='/'>
                  <IconHome className='mr-2 h-4 w-4' />
                  Home
                </Link>
              </Button>
              <Button asChild variant='outline'>
                <Link href='/shop'>
                  <IconShoppingBag className='mr-2 h-4 w-4' />
                  Shop
                </Link>
              </Button>
              <Button asChild variant='ghost'>
                <Link href='/contact'>
                  <IconMail className='mr-2 h-4 w-4' />
                  Support
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
