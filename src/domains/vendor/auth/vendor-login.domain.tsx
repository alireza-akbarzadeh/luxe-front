'use client';

import { IconMail } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';

import { loginAction } from '@/actions/auth.actions';
import { useAppForm } from '@/components/forms/useAppForm';
import { Button } from '@/components/ui/button';
import { createLoginFormSchema } from '@/domains/auth/auth.schema';
import { AuthLanguageSwitcher } from '@/domains/auth/components/auth-language-switcher';
import { VendorLoginSidebar } from '@/domains/vendor/auth/components/vendor-login-sidebar';
import { getDirection, type Locale } from '@/i18n/config';
import { getCallbackUrl } from '@/lib/utils';

const DEFAULT_VENDOR_CALLBACK = '/vendor/panel';

export function VendorLoginDomain() {
  const locale = useLocale() as Locale;
  const pageDir = getDirection(locale);
  const searchParams = useSearchParams();
  const callbackUrl = getCallbackUrl(searchParams.get('callbackUrl') ?? DEFAULT_VENDOR_CALLBACK);
  const t = useTranslations('auth');
  const tLogin = useTranslations('auth.login');
  const tVendor = useTranslations('auth.vendor.login');
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
        formData.append('callbackUrl', callbackUrl);

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
          toast.success(tVendor('welcomeBackToast'));
        }
      });
    }
  });

  const forgotPasswordHref = `/forgot-password?callbackUrl=${encodeURIComponent(callbackUrl)}`;
  const registerHref = `/register?callbackUrl=${encodeURIComponent(callbackUrl)}`;

  return (
    <div className='bg-background flex min-h-screen' dir='ltr'>
      <div className='relative flex flex-1 items-center justify-center p-6 sm:p-12' dir={pageDir}>
        <AuthLanguageSwitcher />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='w-full max-w-md'
        >
          <Link href='/vendor' className='mb-8 inline-block'>
            <span className='text-3xl font-bold tracking-tight'>LUXE</span>
            <span className='text-muted-foreground ml-2 text-sm font-medium tracking-widest uppercase'>
              {t('vendor.brandSuffix')}
            </span>
          </Link>

          <div className='mb-8'>
            <h1 className='mb-2 text-3xl font-bold'>{tVendor('title')}</h1>
            <p className='text-muted-foreground'>{tVendor('subtitle')}</p>
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
              {error ? (
                <div data-testid='form-error' className='mb-2 text-sm text-red-500'>
                  {error}
                </div>
              ) : null}

              <form.AppField name='email'>
                {(field) => (
                  <field.TextField
                    startIcon={IconMail}
                    data-testid='vendor-email-input'
                    label={t('fields.email')}
                    placeholder={tVendor('emailPlaceholder')}
                    inputDir='ltr'
                    className='h-12'
                  />
                )}
              </form.AppField>

              <form.AppField name='password'>
                {(field) => (
                  <field.InputPassword
                    data-testid='vendor-password-input'
                    label={t('fields.password')}
                    placeholder={t('password.enterPlaceholder')}
                    showForgotLink
                    forgotPasswordHref={forgotPasswordHref}
                  />
                )}
              </form.AppField>

              <form.AppField name='rememberMe'>
                {(field) => (
                  <field.Checkbox
                    label={tLogin('rememberMe')}
                    data-testid='vendor-remember-me-checkbox'
                  />
                )}
              </form.AppField>

              <form.Submit
                data-testid='vendor-login-submit'
                isPending={isPending}
                label={tVendor('submit')}
              />
            </form.Root>
          </form.AppForm>

          <p className='text-muted-foreground mt-8 text-center text-sm'>
            {tVendor('noAccount')}{' '}
            <Link href={registerHref} className='text-accent font-medium hover:underline'>
              {tVendor('createAccount')}
            </Link>
          </p>

          <p className='text-muted-foreground mt-4 text-center text-sm'>
            {tVendor('customerSignIn')}{' '}
            <Link href='/login' className='text-foreground font-medium hover:underline'>
              {tVendor('customerSignInLink')}
            </Link>
          </p>

          <div className='mt-6 flex justify-center'>
            <Button variant='ghost' size='sm' asChild>
              <Link href='/vendor'>{tVendor('backToVendorHome')}</Link>
            </Button>
          </div>
        </motion.div>
      </div>

      <VendorLoginSidebar />
    </div>
  );
}
