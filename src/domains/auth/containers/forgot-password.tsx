'use client';

import {
  IconArrowRight,
  IconCheckbox,
  IconKeyFilled,
  IconLoader2,
  IconMail
} from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { forgotPasswordAction } from '@/actions/auth.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ForgotPasswordDomain() {
  const t = useTranslations('auth');
  const tForgot = useTranslations('auth.forgotPassword');
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!email) {
      setError(tForgot('emailRequired'));
      return;
    }

    startTransition(async () => {
      const result = await forgotPasswordAction(email);
      if (result.success) {
        setIsSubmitted(true);
        return;
      }
      setError(result.error ?? tForgot('sendError'));
      toast.error(result.error ?? tForgot('sendError'));
    });
  };

  const handleResend = () => {
    startTransition(async () => {
      const result = await forgotPasswordAction(email);
      if (result.success) {
        toast.success(tForgot('resentToast'));
        return;
      }
      toast.error(result.error ?? tForgot('resendError'));
    });
  };

  return (
    <div className='bg-background relative flex min-h-screen items-center justify-center p-6 pt-16 sm:pt-14'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full max-w-md'
      >
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
                <h1 className='mb-2 text-3xl font-bold'>{tForgot('title')}</h1>
                <p className='text-muted-foreground'>{tForgot('subtitle')}</p>
              </div>

              <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='space-y-2'>
                  <Label htmlFor='email'>{t('fields.email')}</Label>
                  <div className='relative' dir='ltr'>
                    <IconMail className='text-muted-foreground absolute start-3 top-1/2 h-5 w-5 -translate-y-1/2' />
                    <Input
                      id='email'
                      type='email'
                      dir='ltr'
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder={t('fields.emailPlaceholder')}
                      className='h-12 ps-10'
                    />
                  </div>
                  {error ? <p className='text-sm text-red-500'>{error}</p> : null}
                </div>

                <Button type='submit' className='h-12 w-full' disabled={isPending}>
                  {isPending ? (
                    <>
                      <IconLoader2 className='me-2 h-4 w-4 animate-spin' />
                      {tForgot('sending')}
                    </>
                  ) : (
                    <>
                      {tForgot('submit')}
                      <IconArrowRight className='cn-rtl-flip ms-2 h-4 w-4' />
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
              <h1 className='mb-2 text-2xl font-bold'>{tForgot('successTitle')}</h1>
              <p className='text-muted-foreground mb-8'>
                {tForgot.rich('successBody', {
                  email: () => <strong>{email}</strong>
                })}
              </p>
              <Button variant='outline' onClick={handleResend} disabled={isPending}>
                {tForgot('resend')}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
