'use client';

import { IconHome, IconLogin, IconUserCircle } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Unauthorized() {
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
              animate={{ x: [0, -5, 5, -5, 0] }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className='bg-primary/10 mb-6 rounded-full p-4'
            >
              <IconUserCircle size={48} className='text-primary' />
            </motion.div>
            <h1 className='text-foreground text-6xl font-bold tracking-tight'>401</h1>
            <h2 className='mt-2 text-2xl font-semibold'>Authentication required</h2>
            <p className='text-muted-foreground mt-2'>
              Please log in to continue. You need an active session to access this page.
            </p>
            <div className='mt-8 flex flex-wrap justify-center gap-3'>
              <Button asChild variant='default'>
                <Link href='/login'>
                  <IconLogin className='mr-2 h-4 w-4' />
                  Log in
                </Link>
              </Button>
              <Button asChild variant='outline'>
                <Link href='/'>
                  <IconHome className='mr-2 h-4 w-4' />
                  Back to home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
