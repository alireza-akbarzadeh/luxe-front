'use client';

import { IconHome, IconLock, IconLogin } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Forbidden() {
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
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className='bg-warning/10 mb-6 rounded-full p-4'
            >
              <IconLock size={48} className='text-warning' />
            </motion.div>
            <h1 className='text-foreground text-6xl font-bold tracking-tight'>403</h1>
            <h2 className='mt-2 text-2xl font-semibold'>Access forbidden</h2>
            <p className='text-muted-foreground mt-2'>
              You don’t have permission to view this page. Please contact your administrator if you
              believe this is a mistake.
            </p>
            <div className='mt-8 flex flex-wrap justify-center gap-3'>
              <Button asChild variant='default'>
                <Link href='/'>
                  <IconHome className='mr-2 h-4 w-4' />
                  Home
                </Link>
              </Button>
              <Button asChild variant='outline'>
                <Link href='/login'>
                  <IconLogin className='mr-2 h-4 w-4' />
                  Sign in
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
