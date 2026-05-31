'use client';

import { IconHome, IconMail, IconRefresh, IconServerOff } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to your monitoring service
    console.error('Application error:', error);
  }, [error]);

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
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className='bg-destructive/10 mb-6 rounded-full p-4'
            >
              <IconServerOff size={48} className='text-destructive' />
            </motion.div>
            <h1 className='text-foreground text-6xl font-bold tracking-tight'>500</h1>
            <h2 className='mt-2 text-2xl font-semibold'>Something went wrong</h2>
            <p className='text-muted-foreground mt-2'>
              {error?.message || 'An unexpected server error occurred. Our team has been notified.'}
            </p>
            <div className='mt-8 flex flex-wrap justify-center gap-3'>
              <Button onClick={reset} variant='default'>
                <IconRefresh className='mr-2 h-4 w-4' />
                Try again
              </Button>
              <Button asChild variant='outline'>
                <Link href='/'>
                  <IconHome className='mr-2 h-4 w-4' />
                  Home
                </Link>
              </Button>
              <Button asChild variant='ghost'>
                <Link href='/contact'>
                  <IconMail className='mr-2 h-4 w-4' />
                  Contact support
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
