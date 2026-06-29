'use client';

import { IconMail } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';

import { loginAction } from '@/actions/auth.actions';
import { Button } from '@/components/ui/button';
import { getDirection, type Locale } from '@/i18n/config';
import { useAppForm } from '~/src/components/forms/useAppForm';

import { createLoginFormSchema } from '../auth.schema';
import { LegalDocumentLink } from '../components/legal-document-link';
import { LoginSidebar } from '../components/login-sidebar';

export function LoginDomain() {
  const locale = useLocale() as Locale;
  const pageDir = getDirection(locale);
  const t = useTranslations('auth');
  const tLogin = useTranslations('auth.login');
  const tRegister = useTranslations('auth.register');
  const tValidation = useTranslations('auth.validation');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const loginFormSchema = useMemo(() => createLoginFormSchema(tValidation), [tValidation]);

  const form = useAppForm({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    },
    validators: {
      onChange: loginFormSchema,
      onBlur: loginFormSchema
    },
    onSubmit: async ({ value, formApi }) => {
      startTransition(async () => {
        const formData = new FormData();
        formData.append('email', value.email);
        formData.append('password', value.password);
        formData.append('rememberMe', String(value.rememberMe ?? false));

        const result = await loginAction(formData);
        setError(result?.error as string);
        if (result && 'error' in result) {
          toast.error(result.error);
          if (
            result.error.includes('Invalid credentials') ||
            result.error.includes('Credenciales') ||
            result.error.includes('اطلاعات ورود')
          ) {
            formApi.setFieldMeta('password', (prev) => ({
              ...prev,
              error: tLogin('invalidCredentials')
            }));
          }
        } else {
          toast.success(tLogin('welcomeBackToast'));
        }
      });
    }
  });

  return (
    <div className='bg-background flex min-h-screen' dir='ltr'>
      <div
        className='relative flex flex-1 items-center justify-center p-6 pt-16 sm:p-12 sm:pt-14'
        dir={pageDir}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='w-full max-w-md'
        >
          <Link href='/' className='mb-8 inline-block'>
            <span className='text-3xl font-bold tracking-tight'>LUXE</span>
          </Link>

          <div className='mb-8'>
            <h1 className='mb-2 text-3xl font-bold'>{tLogin('title')}</h1>
            <p className='text-muted-foreground'>{tLogin('subtitle')}</p>
          </div>
          <form.AppForm>
            <form.Root
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className='space-y-6'
            >
              {error && (
                <div data-testid='form-error' className='mb-2 text-sm text-red-500'>
                  {error}
                </div>
              )}
              <form.AppField name='email'>
                {(field) => (
                  <field.TextField
                    startIcon={IconMail}
                    data-testid='email-input'
                    label={t('fields.email')}
                    placeholder={t('fields.emailPlaceholder')}
                    inputDir='ltr'
                    className='h-12'
                  />
                )}
              </form.AppField>

              <form.AppField name='password'>
                {(field) => (
                  <field.InputPassword
                    data-testid='password-input'
                    label={t('fields.password')}
                    placeholder={t('password.enterPlaceholder')}
                    showForgotLink
                    forgotPasswordLabel={t('forgotPasswordLink')}
                  />
                )}
              </form.AppField>

              <form.AppField name='rememberMe'>
                {(field) => (
                  <field.Checkbox label={tLogin('rememberMe')} data-testid='remember-me-checkbox' />
                )}
              </form.AppField>

              <form.Submit
                data-testid='login-submit'
                isPending={isPending}
                label={tLogin('submit')}
              />
            </form.Root>
          </form.AppForm>

          <div className='relative my-8'>
            <div className='absolute inset-0 flex items-center'>
              <div className='border-border w-full border-t' />
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='bg-background text-muted-foreground px-4'>
                {tLogin('orContinueWith')}
              </span>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <Button
              type='button'
              variant='outline'
              className='h-12'
              disabled
              onClick={() => toast.message(tLogin('socialComingSoon'))}
            >
              Google
            </Button>
            <Button
              type='button'
              variant='outline'
              className='h-12'
              disabled
              onClick={() => toast.message(tLogin('socialComingSoon'))}
            >
              GitHub
            </Button>
          </div>

          <p className='text-muted-foreground mt-8 text-center text-sm'>
            {tLogin('noAccount')}{' '}
            <Link href='/register' className='text-accent font-medium hover:underline'>
              {tLogin('createAccount')}
            </Link>
          </p>

          <p className='text-muted-foreground mt-4 text-center text-xs leading-relaxed'>
            {tLogin('legalPrefix')}{' '}
            <LegalDocumentLink kind='terms'>{tRegister('termsLink')}</LegalDocumentLink>{' '}
            {tRegister('termsAnd')}{' '}
            <LegalDocumentLink kind='privacy'>{tRegister('privacyLink')}</LegalDocumentLink>
          </p>
        </motion.div>
      </div>

      <LoginSidebar />
    </div>
  );
}
