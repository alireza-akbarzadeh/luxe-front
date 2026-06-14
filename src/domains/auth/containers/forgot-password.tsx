'use client';

import {
  IconArrowLeft,
  IconArrowRight,
  IconCheckbox,
  IconKeyFilled,
  IconLoader2,
  IconMail
} from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { forgotPasswordAction } from '@/actions/auth.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ForgotPasswordDomain() {
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    startTransition(async () => {
      const result = await forgotPasswordAction(email);
      if (result.success) {
        setIsSubmitted(true);
        return;
      }
      setError(result.error ?? 'Unable to send reset email');
      toast.error(result.error ?? 'Unable to send reset email');
    });
  };

  const handleResend = () => {
    startTransition(async () => {
      const result = await forgotPasswordAction(email);
      if (result.success) {
        toast.success('Reset link sent again');
        return;
      }
      toast.error(result.error ?? 'Unable to resend reset email');
    });
  };

  return (
    <div className='bg-background flex min-h-screen items-center justify-center p-6'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full max-w-md'
      >
        <Link
          href='/login'
          className='text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-2 text-sm transition-colors'
        >
          <IconArrowLeft className='h-4 w-4' />
          Back to sign in
        </Link>

        <AnimatePresence mode='wait'>
          {!isSubmitted ? (
            <motion.div
              key='form'
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className='mb-6'>
                <div className='bg-accent/10 flex h-16 w-16 items-center justify-center rounded-2xl'>
                  <IconKeyFilled className='text-accent h-8 w-8' />
                </div>
              </div>

              <div className='mb-8'>
                <h1 className='mb-2 text-3xl font-bold'>Forgot password?</h1>
                <p className='text-muted-foreground'>
                  Enter your email and we&apos;ll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='space-y-2'>
                  <Label htmlFor='email'>Email address</Label>
                  <div className='relative'>
                    <IconMail className='text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2' />
                    <Input
                      id='email'
                      type='email'
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder='name@example.com'
                      className='h-12 pl-10'
                    />
                  </div>
                  {error ? <p className='text-sm text-red-500'>{error}</p> : null}
                </div>

                <Button type='submit' className='h-12 w-full' disabled={isPending}>
                  {isPending ? (
                    <>
                      <IconLoader2 className='mr-2 h-4 w-4 animate-spin' />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send reset link
                      <IconArrowRight className='ml-2 h-4 w-4' />
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key='success'
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className='text-center'
            >
              <div className='mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/30'>
                <IconCheckbox className='h-8 w-8 text-emerald-600' />
              </div>
              <h1 className='mb-2 text-2xl font-bold'>Check your email</h1>
              <p className='text-muted-foreground mb-8'>
                If an account exists for <strong>{email}</strong>, you&apos;ll receive a password
                reset link shortly.
              </p>
              <Button variant='outline' onClick={handleResend} disabled={isPending}>
                Resend email
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
