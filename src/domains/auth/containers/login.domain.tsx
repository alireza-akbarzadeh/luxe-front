'use client';

import { Button } from '@/components/ui/button';
import { IconCheck, IconMail } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAppForm } from '~/src/components/forms/useAppForm';
import { loginFormSchema } from '../auth.schema';
import { toast } from 'sonner';
import { useState, useTransition } from 'react';
import { loginAction } from '@/actions/auth.actions';
import { LoginSidebar } from '../components/login-sidebar';

export function LoginDomain() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const form = useAppForm({
    defaultValues: {
      email: '',
      password: ''
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

        const result = await loginAction(formData);
        setError(result?.error as string);
        if (result && 'error' in result) {
          toast.error(result.error);
          if (result.error.includes('Invalid credentials')) {
            formApi.setFieldMeta('password', (prev) => ({ ...prev, error: 'Invalid credentials' }));
          }
        } else {
          toast.success(`Welcome back!`);
        }
      });
    }
  });

  return (
    <div className='bg-background flex min-h-screen'>
      {/* Left Side - Form */}
      <div className='flex flex-1 items-center justify-center p-6 sm:p-12'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='w-full max-w-md'
        >
          {/* Logo */}
          <Link href='/' className='mb-8 inline-block'>
            <span className='text-3xl font-bold tracking-tight'>LUXE</span>
          </Link>

          {/* Header */}
          <div className='mb-8'>
            <h1 className='mb-2 text-3xl font-bold'>Welcome back</h1>
            <p className='text-muted-foreground'>Enter your credentials to access your account</p>
          </div>

          {/* Demo Credentials Notice */}
          {/* <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='bg-accent/10 border-accent/20 mb-6 rounded-xl border p-4'
          >
            <div className='flex items-start gap-3'>
              <IconCheck className='text-accent mt-0.5 h-5 w-5' />
              <div className='text-sm'>
                <p className='mb-1 font-medium'>Demo Account</p>
                <p className='text-muted-foreground'>
                  Email: <span className='text-foreground font-mono'>demo@luxe.com</span>
                </p>
                <p className='text-muted-foreground'>
                  Password: <span className='text-foreground font-mono'>demo123</span>
                </p>
              </div>
            </div>
          </motion.div> */}

          <form.AppForm>
            <form.Root
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className='space-y-6'
            >
              {/* Show error from store if any */}
              {error && <div className='mb-2 text-sm text-red-500'>{error}</div>}
              {/* Email Field */}
              <form.AppField name='email'>
                {(field) => (
                  <field.TextField
                    startIcon={IconMail}
                    label='Email address'
                    placeholder='name@example.com'
                    className='h-12 pl-10'
                  />
                )}
              </form.AppField>

              {/* Password Field */}
              <form.AppField name='password'>
                {(field) => (
                  <field.InputPassword label='Password' placeholder='Enter your password' />
                )}
              </form.AppField>

              <form.Submit isPending={isPending} label='login' />
            </form.Root>
          </form.AppForm>

          {/* Divider */}
          <div className='relative my-8'>
            <div className='absolute inset-0 flex items-center'>
              <div className='border-border w-full border-t' />
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='bg-background text-muted-foreground px-4'>Or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className='grid grid-cols-2 gap-4'>
            <Button variant='outline' className='h-12'>
              <svg className='mr-2 h-5 w-5' viewBox='0 0 24 24'>
                <path
                  fill='currentColor'
                  d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                />
                <path
                  fill='currentColor'
                  d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                />
                <path
                  fill='currentColor'
                  d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                />
                <path
                  fill='currentColor'
                  d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                />
              </svg>
              Google
            </Button>
            <Button variant='outline' className='h-12'>
              <svg className='mr-2 h-5 w-5' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
              </svg>
              GitHub
            </Button>
          </div>

          {/* Sign Up Link */}
          <p className='text-muted-foreground mt-8 text-center text-sm'>
            Don&apos;t have an account?{' '}
            <Link href='/register' className='text-accent font-medium hover:underline'>
              Create one now
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Branding */}
      <LoginSidebar />
    </div>
  );
}
