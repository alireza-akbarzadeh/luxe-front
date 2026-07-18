'use client';

import { IconMail } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';

import { loginAction } from '@/actions/auth.actions';
import { useAppForm } from '@/components/forms/useAppForm';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Typography } from '@/components/ui/typography';
import { clearClientAccessToken } from '@/lib/auth/auth-session';
import { cn } from '@/lib/utils';

import { createLoginFormSchema } from '../auth.schema';
import { LegalDocumentLink } from './legal-document-link';
import { LoginOtpPanel } from './login-otp-panel';

export type LoginFormPanelProps = {
  callbackUrl: string;
  /** `dialog` skips server redirect and calls onSuccess after cookies are set. */
  variant?: 'page' | 'dialog';
  onSuccess?: () => void;
  showBrandMark?: boolean;
  className?: string;
};

/** Shared password + OTP login form for the full page and auth dialog. */
export function LoginFormPanel({
  callbackUrl,
  variant = 'page',
  onSuccess,
  showBrandMark = false,
  className
}: LoginFormPanelProps) {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const t = useTranslations('auth');
  const tLogin = useTranslations('auth.login');
  const tRegister = useTranslations('auth.register');
  const tValidation = useTranslations('auth.validation');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const clientOnly = variant === 'dialog';

  const loginFormSchema = useMemo(() => createLoginFormSchema(tValidation), [tValidation]);

  const finishClientLogin = async () => {
    clearClientAccessToken();
    await refreshUser();
    toast.success(tLogin('welcomeBackToast'));
    onSuccess?.();
  };

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
        if (clientOnly) {
          formData.append('clientOnly', 'true');
        }

        const result = await loginAction(formData);
        if (!result) return;

        if ('error' in result && result.error) {
          setError(result.error);
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
          return;
        }

        if (clientOnly && 'success' in result) {
          await finishClientLogin();
        }
      });
    }
  });

  const registerHref = `/register?callbackUrl=${encodeURIComponent(callbackUrl)}`;

  return (
    <Flex direction='column' gap={6} className={cn('w-full', className)}>
      {showBrandMark ? (
        <Link href='/' className='inline-block'>
          <Typography.Text className='font-display text-3xl font-bold tracking-tight'>
            LUXE
          </Typography.Text>
        </Link>
      ) : null}

      <Flex direction='column' gap={2}>
        <Typography.H1 className='text-2xl font-bold sm:text-3xl'>
          {variant === 'dialog' ? tLogin('dialogTitle') : tLogin('title')}
        </Typography.H1>
        <Typography.Muted>
          {variant === 'dialog' ? tLogin('dialogSubtitle') : tLogin('subtitle')}
        </Typography.Muted>
      </Flex>

      <Tabs defaultValue='password' className='w-full'>
        <TabsList className='mb-6 grid w-full grid-cols-2'>
          <TabsTrigger value='password'>{tLogin('tabs.password')}</TabsTrigger>
          <TabsTrigger value='otp'>{tLogin('tabs.otp')}</TabsTrigger>
        </TabsList>

        <TabsContent value='password'>
          <form.AppForm>
            <form.Root
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className='space-y-5'
            >
              {error ? (
                <Typography.Text data-testid='form-error' className='text-sm text-red-500'>
                  {error}
                </Typography.Text>
              ) : null}
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
        </TabsContent>

        <TabsContent value='otp'>
          <LoginOtpPanel
            callbackUrl={callbackUrl}
            clientOnly={clientOnly}
            onSuccess={clientOnly ? finishClientLogin : undefined}
          />
        </TabsContent>
      </Tabs>

      <Flex direction='column' gap={4}>
        <Flex align='center' gap={3} className='w-full'>
          <div className='border-border h-px flex-1 border-t' />
          <Typography.Muted className='text-xs whitespace-nowrap'>
            {tLogin('orContinueWith')}
          </Typography.Muted>
          <div className='border-border h-px flex-1 border-t' />
        </Flex>

        <Flex direction='row' gap={3} className='w-full'>
          <Button
            type='button'
            variant='outline'
            className='h-11 flex-1'
            disabled
            onClick={() => toast.message(tLogin('socialComingSoon'))}
          >
            Google
          </Button>
          <Button
            type='button'
            variant='outline'
            className='h-11 flex-1'
            disabled
            onClick={() => toast.message(tLogin('socialComingSoon'))}
          >
            GitHub
          </Button>
        </Flex>
      </Flex>

      <Typography.Muted className='text-center text-sm'>
        {tLogin('noAccount')}{' '}
        {variant === 'dialog' ? (
          <button
            type='button'
            className='text-accent font-medium hover:underline'
            onClick={() => router.push(registerHref)}
          >
            {tLogin('createAccount')}
          </button>
        ) : (
          <Link href={registerHref} className='text-accent font-medium hover:underline'>
            {tLogin('createAccount')}
          </Link>
        )}
      </Typography.Muted>

      <Typography.Muted className='text-center text-xs leading-relaxed'>
        {tLogin('legalPrefix')}{' '}
        <LegalDocumentLink kind='terms'>{tRegister('termsLink')}</LegalDocumentLink>{' '}
        {tRegister('termsAnd')}{' '}
        <LegalDocumentLink kind='privacy'>{tRegister('privacyLink')}</LegalDocumentLink>
      </Typography.Muted>
    </Flex>
  );
}
