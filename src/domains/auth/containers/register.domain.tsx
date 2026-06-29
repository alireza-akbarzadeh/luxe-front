'use client';

import { IconCheck, IconMail, IconUser, IconX } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { getDirection, type Locale } from '@/i18n/config';
import { registerAction } from '~/src/actions/auth.actions';
import { useAppForm } from '~/src/components/forms/useAppForm';

import { createRegisterFormSchema } from '../auth.schema';
import { LegalDocumentLink } from '../components/legal-document-link';
import { RegisterSidebar } from '../components/register-sidebar';
import { getPasswordStrength, passwordRequirementKeys } from '../utils.auth';

export function RegisterDomain() {
  const locale = useLocale() as Locale;
  const pageDir = getDirection(locale);
  const t = useTranslations('auth');
  const tRegister = useTranslations('auth.register');
  const tPassword = useTranslations('auth.password');
  const tValidation = useTranslations('auth.validation');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const registerFormSchema = useMemo(() => createRegisterFormSchema(tValidation), [tValidation]);

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
      onSubmit: registerFormSchema,
      onChange: registerFormSchema
    },
    onSubmit: async ({ value, formApi }) => {
      startTransition(async () => {
        const formData = new FormData();
        formData.append('email', value.email);
        formData.append('password', value.password);
        formData.append('firstName', value.firstName);
        formData.append('lastName', value.lastName);
        if (value.phone) formData.append('phone', value.phone);
        formData.append('acceptTerms', String(value.acceptTerms));
        formData.append('acceptMarketing', String(value.acceptMarketing));

        const result = await registerAction(formData);
        if (result && 'error' in result) {
          setError(result.error);
          toast.error(result.error);
          if (
            result.error.includes('duplicate') ||
            result.error.includes('already exists') ||
            result.error.includes('ya está') ||
            result.error.includes('قبلاً')
          ) {
            formApi.setFieldMeta('email', (prev) => ({
              ...prev,
              error: tRegister('emailAlreadyRegistered')
            }));
          }
        } else {
          toast.success(tRegister('successToast'));
          router.push('/account');
        }
      });
    }
  });

  const password = form.getFieldValue('password');
  const passwordStrength = getPasswordStrength(password);

  return (
    <div className='bg-background flex min-h-screen' dir='ltr'>
      <div
        className='relative flex flex-1 items-center justify-center overflow-y-auto p-6 pt-16 sm:p-12 sm:pt-14'
        dir={pageDir}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='w-full max-w-md py-8'
        >
          <Link href='/' className='mb-8 inline-block'>
            <span className='text-3xl font-bold tracking-tight'>LUXE</span>
          </Link>

          <div className='mb-8'>
            <h1 className='mb-2 text-3xl font-bold'>{tRegister('title')}</h1>
            <p className='text-muted-foreground'>{tRegister('subtitle')}</p>
          </div>

          {error && (
            <motion.div
              data-testid='register-error'
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
              <div className='grid grid-cols-2 gap-4'>
                <form.AppField name='firstName'>
                  {(field) => (
                    <field.TextField
                      data-testid='firstName-input'
                      label={t('fields.firstName')}
                      placeholder={t('fields.firstNamePlaceholder')}
                      startIcon={IconUser}
                      className='h-12'
                    />
                  )}
                </form.AppField>

                <form.AppField name='lastName'>
                  {(field) => (
                    <field.TextField
                      data-testid='lastName-input'
                      label={t('fields.lastName')}
                      placeholder={t('fields.lastNamePlaceholder')}
                      className='h-12'
                    />
                  )}
                </form.AppField>
              </div>

              <form.AppField name='email'>
                {(field) => (
                  <field.TextField
                    data-testid='email-input'
                    label={t('fields.email')}
                    placeholder={t('fields.emailPlaceholder')}
                    startIcon={IconMail}
                    inputDir='ltr'
                    className='h-12'
                  />
                )}
              </form.AppField>

              <form.AppField name='phone'>
                {(field) => (
                  <field.InputPhone
                    data-testid='phone-input'
                    label={t('fields.phone')}
                    placeholder={t('fields.phonePlaceholder')}
                    className='h-12'
                  />
                )}
              </form.AppField>

              <form.AppField name='password'>
                {(field) => (
                  <div className='space-y-3'>
                    <field.InputPassword
                      data-testid='password-input'
                      label={t('fields.password')}
                      placeholder={t('password.createPlaceholder')}
                    />

                    {password && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className='space-y-3'
                      >
                        <div className='space-y-1'>
                          <div className='flex justify-between text-xs'>
                            <span className='text-muted-foreground'>{tPassword('strength')}</span>

                            <span
                              className={`font-medium ${
                                passwordStrength.score >= 3
                                  ? 'text-green-500'
                                  : passwordStrength.score >= 2
                                    ? 'text-yellow-500'
                                    : 'text-red-500'
                              }`}
                            >
                              {tPassword(passwordStrength.labelKey)}
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
                          {passwordRequirementKeys.map((req) => {
                            const passed = req.test(password);

                            return (
                              <div
                                key={req.key}
                                className={`flex items-center gap-2 text-xs ${
                                  passed ? 'text-green-500' : 'text-muted-foreground'
                                }`}
                              >
                                {passed ? (
                                  <IconCheck className='size-3.5' />
                                ) : (
                                  <IconX className='size-3.5' />
                                )}

                                {tPassword(`requirements.${req.key}`)}
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
              </form.AppField>

              <form.AppField name='confirmPassword'>
                {(field) => (
                  <field.InputPassword
                    data-testid='confirmPassword-input'
                    label={t('fields.confirmPassword')}
                    placeholder={t('password.confirmPlaceholder')}
                  />
                )}
              </form.AppField>

              <div className='space-y-4'>
                <form.AppField name='acceptTerms'>
                  {(field) => (
                    <div className='flex flex-wrap items-start gap-3'>
                      <field.Checkbox data-testid='acceptTerms-checkbox' label='' />
                      <Label
                        htmlFor={field.name}
                        className='cursor-pointer text-sm leading-relaxed font-normal'
                      >
                        {tRegister('termsPrefix')}{' '}
                        <LegalDocumentLink kind='terms'>{tRegister('termsLink')}</LegalDocumentLink>{' '}
                        {tRegister('termsAnd')}{' '}
                        <LegalDocumentLink kind='privacy'>
                          {tRegister('privacyLink')}
                        </LegalDocumentLink>
                      </Label>
                    </div>
                  )}
                </form.AppField>

                <form.AppField name='acceptMarketing'>
                  {(field) => (
                    <div className='flex items-start gap-3'>
                      <field.Checkbox data-testid='acceptMarketing-checkbox' label='' />
                      <Label
                        htmlFor={field.name}
                        className='cursor-pointer text-sm leading-relaxed font-normal'
                      >
                        {tRegister('marketingOptIn')}
                      </Label>
                    </div>
                  )}
                </form.AppField>
              </div>

              <form.Submit
                data-testid='register-submit'
                label={tRegister('submit')}
                isPending={isPending}
              />
            </form.Root>
          </form.AppForm>

          <div className='relative my-8'>
            <div className='absolute inset-0 flex items-center'>
              <div className='border-border w-full border-t' />
            </div>

            <div className='relative flex justify-center text-sm'>
              <span className='bg-background text-muted-foreground px-4'>
                {tRegister('orSignUpWith')}
              </span>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <Button
              type='button'
              variant='outline'
              className='h-12'
              disabled
              onClick={() => toast.message(tRegister('socialComingSoon'))}
            >
              Google
            </Button>

            <Button
              type='button'
              variant='outline'
              className='h-12'
              disabled
              onClick={() => toast.message(tRegister('socialComingSoon'))}
            >
              GitHub
            </Button>
          </div>

          <p className='text-muted-foreground mt-8 text-center text-sm'>
            {tRegister('hasAccount')}{' '}
            <Link href='/login' className='text-accent font-medium hover:underline'>
              {tRegister('signIn')}
            </Link>
          </p>
        </motion.div>
      </div>

      <RegisterSidebar />
    </div>
  );
}
