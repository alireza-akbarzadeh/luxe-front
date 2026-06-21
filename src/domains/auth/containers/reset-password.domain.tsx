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
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';

import { resetPasswordAction } from '@/actions/auth.actions';
import { Button } from '@/components/ui/button';
import { useAppForm } from '~/src/components/forms/useAppForm';

import { createResetPasswordFormSchema } from '../auth.schema';
import { AuthLanguageSwitcher } from '../components/auth-language-switcher';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const tReset = useTranslations('auth.resetPassword');
  const tFields = useTranslations('auth.fields');
  const tValidation = useTranslations('auth.validation');
  const [isPending, startTransition] = useTransition();
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetPasswordFormSchema = useMemo(
    () => createResetPasswordFormSchema(tValidation),
    [tValidation]
  );

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
        setError(tReset('invalidToken'));
        return;
      }

      startTransition(async () => {
        const result = await resetPasswordAction(token, value.password);
        if (result.success) {
          setIsComplete(true);
          toast.success(tReset('successToast'));
          return;
        }

        const message = result.error ?? tReset('resetError');
        setError(message);
        toast.error(message);
      });
    }
  });

  if (!token) {
    return (
      <div className='text-center'>
        <h1 className='mb-2 text-2xl font-bold'>{tReset('invalidLinkTitle')}</h1>
        <p className='text-muted-foreground mb-6'>{tReset('invalidLinkBody')}</p>
        <Button asChild>
          <Link href='/forgot-password'>{tReset('requestNewLink')}</Link>
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
            <h1 className='mb-2 text-3xl font-bold'>{tReset('title')}</h1>
            <p className='text-muted-foreground'>{tReset('subtitle')}</p>
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
                    label={tReset('newPassword')}
                    placeholder={tReset('newPasswordPlaceholder')}
                  />
                )}
              </form.AppField>

              <form.AppField name='confirmPassword'>
                {(field) => (
                  <field.InputPassword
                    data-testid='reset-confirm-password-input'
                    label={tFields('confirmPassword')}
                    placeholder={tReset('confirmPlaceholder')}
                  />
                )}
              </form.AppField>

              <form.Submit
                data-testid='reset-password-submit'
                isPending={isPending}
                label={tReset('submit')}
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
          <h1 className='mb-2 text-2xl font-bold'>{tReset('successTitle')}</h1>
          <p className='text-muted-foreground mb-8'>{tReset('successBody')}</p>
          <Button className='h-12 w-full' onClick={() => router.push('/login')}>
            {tReset('continueToSignIn')}
            <IconArrowRight className='cn-rtl-flip ms-2 h-4 w-4' />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ResetPasswordDomain() {
  const tReset = useTranslations('auth.resetPassword');

  return (
    <div className='bg-background relative flex min-h-screen items-center justify-center p-6'>
      <AuthLanguageSwitcher />
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
          <IconArrowLeft className='cn-rtl-flip h-4 w-4' />
          {tReset('backToSignIn')}
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
