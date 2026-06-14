'use client';

import {
  IconArrowLeft,
  IconArrowRight,
  IconCheckbox,
  IconLoader2,
  IconMail
} from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';

import { verifyEmailAction } from '@/actions/auth.actions';
import { Button } from '@/components/ui/button';

type VerifyState = 'loading' | 'success' | 'error';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [state, setState] = useState<VerifyState>('loading');
  const [message, setMessage] = useState<string | null>(null);
  const hasVerified = useRef(false);

  useEffect(() => {
    if (hasVerified.current) return;
    hasVerified.current = true;

    if (token) {
      void verifyEmailAction(token).then((result) => {
        if (result.success) {
          setState('success');
          setMessage('Your email has been verified successfully.');
          return;
        }

        setState('error');
        setMessage(result.error ?? 'Email verification failed.');
      });
    }
  }, [token]);

  return (
    <AnimatePresence mode='wait'>
      {state === 'loading' ? (
        <motion.div
          key='loading'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='flex flex-col items-center py-8 text-center'
        >
          <IconLoader2 className='text-muted-foreground mb-4 h-10 w-10 animate-spin' />
          <p className='text-muted-foreground'>Verifying your email...</p>
        </motion.div>
      ) : state === 'success' ? (
        <motion.div
          key='success'
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className='text-center'
        >
          <div className='mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/30'>
            <IconCheckbox className='h-8 w-8 text-emerald-600' />
          </div>
          <h1 className='mb-2 text-2xl font-bold'>Email verified</h1>
          <p className='text-muted-foreground mb-8'>{message}</p>
          <Button className='h-12 w-full' onClick={() => router.push('/account')}>
            Go to account
            <IconArrowRight className='ml-2 h-4 w-4' />
          </Button>
        </motion.div>
      ) : (
        <motion.div
          key='error'
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className='text-center'
        >
          <div className='bg-destructive/10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full'>
            <IconMail className='text-destructive h-8 w-8' />
          </div>
          <h1 className='mb-2 text-2xl font-bold'>Verification failed</h1>
          <p className='text-muted-foreground mb-8'>{message}</p>
          <Button asChild variant='outline' className='h-12 w-full'>
            <Link href='/account'>Back to account</Link>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function VerifyEmailDomain() {
  return (
    <div className='bg-background flex min-h-screen items-center justify-center p-6'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full max-w-md'
      >
        <Link
          href='/account'
          className='text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-2 text-sm transition-colors'
        >
          <IconArrowLeft className='h-4 w-4' />
          Back to account
        </Link>

        <Suspense
          fallback={
            <div className='flex items-center justify-center py-12'>
              <IconLoader2 className='text-muted-foreground h-8 w-8 animate-spin' />
            </div>
          }
        >
          <VerifyEmailContent />
        </Suspense>
      </motion.div>
    </div>
  );
}
