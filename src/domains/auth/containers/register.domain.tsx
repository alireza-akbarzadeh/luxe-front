'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { IconCheck, IconMail, IconUser, IconX } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { registerAction } from '~/src/actions/auth.actions';
import { useAppForm } from '~/src/components/forms/useAppForm';
import { registerFormSchema } from '../auth.schema';
import { getPasswordStrength, passwordRequirements } from '../utils.auth';
import { RegisterSidebar } from '../components/register-sidebar';

export function RegisterDomain() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const form = useAppForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
      acceptMarketing: false
    },
    validators: {
      onSubmit:registerFormSchema,
      onChange: registerFormSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      startTransition(async () => {
        const formData = new FormData();
        formData.append('email', value.email);
        formData.append('password', value.password);
        formData.append('firstName', value.firstName);
        formData.append('lastName', value.lastName);
        if (value.phone) formData.append('phone', value.phone);
        formData.append('acceptMarketing', String(value.acceptMarketing));

        const result = await registerAction(formData);
        if (result && 'error' in result) {
          setError(result.error);
          toast.error(result.error);
          if (result.error.includes('duplicate') || result.error.includes('already exists')) {
            formApi.setFieldMeta('email', (prev) => ({
              ...prev,
              error: 'Email already registered'
            }));
          }
        } else {
          toast.success('Account created! Redirecting...');
          router.push('/account');
        }
      });
    }
  });

  const password = form.getFieldValue('password');
  const passwordStrength = getPasswordStrength(password);

  return (
    <div className='bg-background flex min-h-screen'>
      {/* Left Side */}
      <RegisterSidebar />
      {/* Right Side */}
      <div className='flex flex-1 items-center justify-center overflow-y-auto p-6 sm:p-12'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='w-full max-w-md py-8'
        >
          {/* Logo */}
          <Link href='/' className='mb-8 inline-block'>
            <span className='text-3xl font-bold tracking-tight'>LUXE</span>
          </Link>

          {/* Header */}
          <div className='mb-8'>
            <h1 className='mb-2 text-3xl font-bold'>Create your account</h1>

            <p className='text-muted-foreground'>Start your premium shopping journey today</p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className='bg-destructive/10 border-destructive/20 text-destructive mb-6 rounded-xl border p-4 text-sm'
            >
              {error}
            </motion.div>
          )}

          <form.AppForm>
            <form.Root
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className='space-y-5'
            >
              {/* Names */}
              <div className='grid grid-cols-2 gap-4'>
                <form.AppField name='firstName'>
                  {(field) => (
                    <field.TextField
                      label='First name'
                      placeholder='John'
                      startIcon={IconUser}
                      className='h-12'
                    />
                  )}
                </form.AppField>

                <form.AppField name='lastName'>
                  {(field) => (
                    <field.TextField label='Last name' placeholder='Doe' className='h-12' />
                  )}
                </form.AppField>
              </div>

              {/* Email */}
              <form.AppField name='email'>
                {(field) => (
                  <field.TextField
                    label='Email address'
                    placeholder='name@example.com'
                    startIcon={IconMail}
                    className='h-12'
                  />
                )}
              </form.AppField>
              {/* Email */}
              <form.AppField name='phone'>
                {(field) => (
                  <field.InputPhone
                    label='Email address'
                    placeholder='name@example.com'
                    startIcon={IconMail}
                    className='h-12'
                  />
                )}
              </form.AppField>

              {/* Password */}
              <form.AppField name='password'>
                {(field) => (
                  <div className='space-y-3'>
                    <field.InputPassword label='Password' placeholder='Create a strong password' />

                    {password && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className='space-y-3'
                      >
                        <div className='space-y-1'>
                          <div className='flex justify-between text-xs'>
                            <span className='text-muted-foreground'>Password strength</span>

                            <span
                              className={`font-medium ${
                                passwordStrength.score >= 3
                                  ? 'text-green-500'
                                  : passwordStrength.score >= 2
                                    ? 'text-yellow-500'
                                    : 'text-red-500'
                              }`}
                            >
                              {passwordStrength.label}
                            </span>
                          </div>

                          <div className='bg-muted h-1.5 overflow-hidden rounded-full'>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${(passwordStrength.score / 5) * 100}%`
                              }}
                              transition={{ duration: 0.3 }}
                              className={passwordStrength.color}
                            />
                          </div>
                        </div>

                        <div className='grid grid-cols-2 gap-2'>
                          {passwordRequirements.map((req) => {
                            const passed = req.test(password);

                            return (
                              <div
                                key={req.label}
                                className={`flex items-center gap-2 text-xs ${
                                  passed ? 'text-green-500' : 'text-muted-foreground'
                                }`}
                              >
                                {passed ? (
                                  <IconCheck className='size-3.5' />
                                ) : (
                                  <IconX className='size-3.5' />
                                )}

                                {req.label}
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
              </form.AppField>

              {/* Confirm Password */}
              <form.AppField name='confirmPassword'>
                {(field) => (
                  <field.InputPassword
                    label='Confirm password'
                    placeholder='Confirm your password'
                  />
                )}
              </form.AppField>

              {/* Terms */}
              <div className='space-y-4'>
                <form.AppField name='acceptTerms'>
                  {(field) => (
                    <div className='flex flex-wrap items-start gap-3'>
                      <field.Checkbox label='' />
                      <Label
                        htmlFor={field.name}
                        className='cursor-pointer text-sm leading-relaxed font-normal'
                      >
                        I agree to the{' '}
                        <Link href='/terms' className='text-accent hover:underline'>
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href='/privacy' className='text-accent hover:underline'>
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>
                  )}
                </form.AppField>

                <form.AppField name='acceptMarketing'>
                  {(field) => (
                    <div className='flex items-start gap-3'>
                      <field.Checkbox label='' />
                      <Label
                        htmlFor={field.name}
                        className='cursor-pointer text-sm leading-relaxed font-normal'
                      >
                        I want to receive exclusive offers, style tips, and updates
                      </Label>
                    </div>
                  )}
                </form.AppField>
              </div>

              {/* Submit */}
              <form.Submit label='Register' isPending={isPending} />
            </form.Root>
          </form.AppForm>

          {/* Divider */}
          <div className='relative my-8'>
            <div className='absolute inset-0 flex items-center'>
              <div className='border-border w-full border-t' />
            </div>

            <div className='relative flex justify-center text-sm'>
              <span className='bg-background text-muted-foreground px-4'>Or sign up with</span>
            </div>
          </div>

          {/* Social */}
          <div className='grid grid-cols-2 gap-4'>
            <Button variant='outline' className='h-12'>
              Google
            </Button>

            <Button variant='outline' className='h-12'>
              GitHub
            </Button>
          </div>

          {/* Footer */}
          <p className='text-muted-foreground mt-8 text-center text-sm'>
            Already have an account?{' '}
            <Link href='/login' className='text-accent font-medium hover:underline'>
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
