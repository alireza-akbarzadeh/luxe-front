'use client';

import {
  IconArrowLeft,
  IconArrowRight,
  IconCheckbox,
  IconKeyFilled,
  IconLoader2,
  IconMail
} from '@tabler/icons-react';
import { AnimatePresence,motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/auth.store';

export function ForgotPasswordDomain() {
  const { resetPassword, isLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    const success = await resetPassword(email);
    if (success) {
      setIsSubmitted(true);
    }
  };

  const handleResend = async () => {
    await resetPassword(email);
  };

  return (
    <div className='bg-background flex min-h-screen items-center justify-center p-6'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full max-w-md'
      >
        {/* Back Link */}
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
              {/* Icon */}
              <div className='mb-6'>
                <div className='bg-accent/10 flex h-16 w-16 items-center justify-center rounded-2xl'>
                  <IconKeyFilled className='text-accent h-8 w-8' />
                </div>
              </div>

              {/* Header */}
              <div className='mb-8'>
                <h1 className='mb-2 text-3xl font-bold'>Forgot your password?</h1>
                <p className='text-muted-foreground'>
                  No worries! Enter your email address and we&apos;ll send you instructions to reset
                  your password.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='bg-destructive/10 border-destructive/20 text-destructive mb-6 rounded-xl border p-4 text-sm'
                >
                  {error}
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className='space-y-5'>
                <div className='space-y-2'>
                  <Label htmlFor='email'>Email address</Label>
                  <div className='relative'>
                    <IconMail className='text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2' />
                    <Input
                      id='email'
                      type='email'
                      placeholder='name@example.com'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className='h-12 pl-10'
                      required
                    />
                  </div>
                </div>

                <Button
                  type='submit'
                  size='lg'
                  className='bg-accent hover:bg-accent/90 text-accent-foreground h-12 w-full'
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <IconLoader2 className='mr-2 h-5 w-5 animate-spin' />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send reset instructions
                      <IconArrowRight className='ml-2 h-5 w-5' />
                    </>
                  )}
                </Button>
              </form>

              {/* Help Text */}
              <p className='text-muted-foreground mt-8 text-center text-sm'>
                Remember your password?{' '}
                <Link href='/login' className='text-accent font-medium hover:underline'>
                  Sign in
                </Link>
              </p>
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
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className='mb-6 inline-flex'
              >
                <div className='flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30'>
                  <IconCheckbox className='h-10 w-10 text-green-600 dark:text-green-400' />
                </div>
              </motion.div>

              {/* Success Message */}
              <h1 className='mb-2 text-3xl font-bold'>Check your email</h1>
              <p className='text-muted-foreground mb-2'>
                We&apos;ve sent password reset instructions to:
              </p>
              <p className='mb-8 text-lg font-medium'>{email}</p>

              {/* Instructions */}
              <div className='bg-muted/50 mb-8 rounded-xl p-6 text-left'>
                <h3 className='mb-3 font-medium'>What to do next:</h3>
                <ol className='text-muted-foreground space-y-2 text-sm'>
                  <li className='flex items-start gap-2'>
                    <span className='bg-accent/20 text-accent flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-medium'>
                      1
                    </span>
                    Check your inbox (and spam folder)
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='bg-accent/20 text-accent flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-medium'>
                      2
                    </span>
                    Click the reset link in the email
                  </li>
                  <li className='flex items-start gap-2'>
                    <span className='bg-accent/20 text-accent flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-medium'>
                      3
                    </span>
                    Create a new secure password
                  </li>
                </ol>
              </div>

              {/* Actions */}
              <div className='space-y-4'>
                <Link href='/login'>
                  <Button
                    size='lg'
                    className='bg-accent hover:bg-accent/90 text-accent-foreground h-12 w-full'
                  >
                    Return to sign in
                    <IconArrowRight className='ml-2 h-5 w-5' />
                  </Button>
                </Link>

                <Button
                  variant='ghost'
                  size='lg'
                  className='h-12 w-full'
                  onClick={handleResend}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <IconLoader2 className='mr-2 h-5 w-5 animate-spin' />
                      Resending...
                    </>
                  ) : (
                    "Didn't receive the email? Resend"
                  )}
                </Button>
              </div>

              {/* Support Link */}
              <p className='text-muted-foreground mt-8 text-sm'>
                Still having trouble?{' '}
                <Link href='/contact' className='text-accent font-medium hover:underline'>
                  Contact support
                </Link>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
