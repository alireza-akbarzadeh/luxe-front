'use client';

import {
  IconArrowLeft,
  IconArrowRight,
  IconCheckbox,
  IconKeyFilled,
  IconLoader2
} from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState, useTransition } from 'react';
import { toast } from 'sonner';

import { resetPasswordAction } from '@/actions/auth.actions';
import { Button } from '@/components/ui/button';
import { useAppForm } from '~/src/components/forms/useAppForm';

import { resetPasswordFormSchema } from '../auth.schema';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [isPending, startTransition] = useTransition();
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useAppForm({
    defaultValues: {
      password: '',
      confirmPassword: ''
    },
    validators: {
      onChange: resetPasswordFormSchema,
      onBlur: resetPasswordFormSchema
    },
    onSubmit: async ({ value }) => {
      if (!token) {
        setError('Reset link is invalid or expired');
        return;
      }

      startTransition(async () => {
        const result = await resetPasswordAction(token, value.password);
        if (result.success) {
          setIsComplete(true);
          toast.success('Password updated successfully');
          return;
        }

        setError(result.error ?? 'Unable to reset password');
        toast.error(result.error ?? 'Unable to reset password');
      });
    }
  });

  if (!token) {
    return (
      <div className='text-center'>
        <h1 className='mb-2 text-2xl font-bold'>Invalid reset link</h1>
        <p className='text-muted-foreground mb-6'>
          This password reset link is missing or has expired.
        </p>
        <Button asChild>
          <Link href='/forgot-password'>Request a new link</Link>
        </Button>
      </div>
    );
  }

  return (
    <AnimatePresence mode='wait'>
      {!isComplete ? (
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
            <h1 className='mb-2 text-3xl font-bold'>Set a new password</h1>
            <p className='text-muted-foreground'>Choose a strong password for your account.</p>
          </div>

          <form.AppForm>
            <form.Root
              onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();
                form.handleSubmit();
              }}
              className='space-y-6'
            >
              {error ? <p className='text-sm text-red-500'>{error}</p> : null}

              <form.AppField name='password'>
                {(field) => (
                  <field.InputPassword
                    data-testid='reset-password-input'
                    label='New password'
                    placeholder='Enter your new password'
                  />
                )}
              </form.AppField>

              <form.AppField name='confirmPassword'>
                {(field) => (
                  <field.InputPassword
                    data-testid='reset-confirm-password-input'
                    label='Confirm password'
                    placeholder='Confirm your new password'
                  />
                )}
              </form.AppField>

              <form.Submit
                data-testid='reset-password-submit'
                isPending={isPending}
                label='Update password'
              />
            </form.Root>
          </form.AppForm>
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
          <h1 className='mb-2 text-2xl font-bold'>Password updated</h1>
          <p className='text-muted-foreground mb-8'>
            Your password has been reset. Sign in with your new password.
          </p>
          <Button className='h-12 w-full' onClick={() => router.push('/login')}>
            Continue to sign in
            <IconArrowRight className='ml-2 h-4 w-4' />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ResetPasswordDomain() {
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

        <Suspense
          fallback={
            <div className='flex items-center justify-center py-12'>
              <IconLoader2 className='text-muted-foreground h-8 w-8 animate-spin' />
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </motion.div>
    </div>
  );
}
