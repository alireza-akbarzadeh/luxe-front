'use client';

import { IconMail } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { loginAction } from '@/actions/auth.actions';
import { useAppForm } from '@/components/forms/useAppForm';
import { Button } from '@/components/ui/button';
import { loginFormSchema } from '@/domains/auth/auth.schema';
import { VendorLoginSidebar } from '@/domains/vendor/auth/components/vendor-login-sidebar';
import { getCallbackeUrl } from '@/lib/utils';

const DEFAULT_VENDOR_CALLBACK = '/vendor/panel';

export function VendorLoginDomain() {
  const searchParams = useSearchParams();
  const callbackUrl = getCallbackeUrl(searchParams.get('callbackUrl') ?? DEFAULT_VENDOR_CALLBACK);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

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
          if (result.error.includes('Invalid credentials')) {
            formApi.setFieldMeta('password', (prev) => ({ ...prev, error: 'Invalid credentials' }));
          }
        } else {
          toast.success('Welcome back to your vendor panel');
        }
      });
    }
  });

  const forgotPasswordHref = `/forgot-password?callbackUrl=${encodeURIComponent(callbackUrl)}`;
  const registerHref = `/register?callbackUrl=${encodeURIComponent(callbackUrl)}`;

  return (
    <div className='bg-background flex min-h-screen'>
      <div className='flex flex-1 items-center justify-center p-6 sm:p-12'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='w-full max-w-md'
        >
          <Link href='/vendor' className='mb-8 inline-block'>
            <span className='text-3xl font-bold tracking-tight'>LUXE</span>
            <span className='text-muted-foreground ml-2 text-sm font-medium tracking-widest uppercase'>
              Vendor
            </span>
          </Link>

          <div className='mb-8'>
            <h1 className='mb-2 text-3xl font-bold'>Vendor sign in</h1>
            <p className='text-muted-foreground'>
              Access your seller panel to manage catalog, orders, and storefront settings.
            </p>
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
                    label='Email address'
                    placeholder='seller@yourbrand.com'
                    className='h-12 pl-10'
                  />
                )}
              </form.AppField>

              <form.AppField name='password'>
                {(field) => (
                  <field.InputPassword
                    data-testid='vendor-password-input'
                    label='Password'
                    placeholder='Enter your password'
                    showForgotLink
                    forgotPasswordHref={forgotPasswordHref}
                  />
                )}
              </form.AppField>

              <form.AppField name='rememberMe'>
                {(field) => (
                  <field.Checkbox
                    label='Remember me for 7 days'
                    data-testid='vendor-remember-me-checkbox'
                  />
                )}
              </form.AppField>

              <form.Submit
                data-testid='vendor-login-submit'
                isPending={isPending}
                label='Sign in to vendor panel'
              />
            </form.Root>
          </form.AppForm>

          <p className='text-muted-foreground mt-8 text-center text-sm'>
            New to Luxe marketplace?{' '}
            <Link href={registerHref} className='text-accent font-medium hover:underline'>
              Create a seller account
            </Link>
          </p>

          <p className='text-muted-foreground mt-4 text-center text-sm'>
            Shopping as a customer?{' '}
            <Link href='/login' className='text-foreground font-medium hover:underline'>
              Customer sign in
            </Link>
          </p>

          <div className='mt-6 flex justify-center'>
            <Button variant='ghost' size='sm' asChild>
              <Link href='/vendor'>← Back to vendor home</Link>
            </Button>
          </div>
        </motion.div>
      </div>

      <VendorLoginSidebar />
    </div>
  );
}
