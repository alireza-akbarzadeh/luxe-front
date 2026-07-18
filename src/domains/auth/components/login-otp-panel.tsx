'use client';

import { IconLoader2, IconMail } from '@tabler/icons-react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useTranslations } from 'next-intl';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { requestLoginOTPAction, verifyLoginOTPAction } from '@/actions/auth.actions';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Flex } from '@/components/ui/flex';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { Typography } from '@/components/ui/typography';

type LoginOtpPanelProps = {
  callbackUrl: string;
};

/** Passwordless login: request a 6-digit email code, then verify with Input OTP. */
export function LoginOtpPanel({ callbackUrl }: LoginOtpPanelProps) {
  const t = useTranslations('auth.login.otp');
  const [isPending, startTransition] = useTransition();
  const [identifier, setIdentifier] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [maskedDestination, setMaskedDestination] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendCode = () => {
    setError(null);
    startTransition(async () => {
      const result = await requestLoginOTPAction(identifier);
      if ('error' in result) {
        setError(result.error);
        toast.error(result.error);
        return;
      }
      setMaskedDestination(result.masked_destination ?? '');
      setStep('verify');
      setCode('');
      toast.success(t('codeSentToast'));
    });
  };

  const verifyCode = (otpValue: string) => {
    if (otpValue.length !== 6) return;
    setError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.append('identifier', identifier);
      formData.append('code', otpValue);
      formData.append('rememberMe', String(rememberMe));
      formData.append('callbackUrl', callbackUrl);

      const result = await verifyLoginOTPAction(formData);
      if (result && 'error' in result) {
        setError(result.error);
        toast.error(result.error);
        setCode('');
      }
    });
  };

  if (step === 'verify') {
    return (
      <Flex direction='column' gap={6}>
        <Flex direction='column' gap={2}>
          <Typography.Muted>
            {maskedDestination
              ? t('codeSentTo', { destination: maskedDestination })
              : t('codeSentGeneric')}
          </Typography.Muted>
          <Typography.Muted className='text-xs'>{t('phoneNote')}</Typography.Muted>
        </Flex>

        {error ? (
          <Typography.Text className='text-sm text-red-500' data-testid='otp-form-error'>
            {error}
          </Typography.Text>
        ) : null}

        <Flex direction='column' gap={2} className='items-center'>
          <Label htmlFor='login-otp'>{t('codeLabel')}</Label>
          <InputOTP
            id='login-otp'
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
            value={code}
            disabled={isPending}
            onChange={(value) => {
              setCode(value);
              if (value.length === 6) verifyCode(value);
            }}
            containerClassName='justify-center'
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </Flex>

        <Flex align='center' gap={2}>
          <Checkbox
            id='otp-remember'
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked === true)}
            disabled={isPending}
          />
          <Label htmlFor='otp-remember' className='font-normal'>
            {t('rememberMe')}
          </Label>
        </Flex>

        <Button
          type='button'
          className='h-12 w-full'
          disabled={isPending || code.length !== 6}
          onClick={() => verifyCode(code)}
          data-testid='otp-verify-submit'
        >
          {isPending ? <IconLoader2 className='me-2 size-4 animate-spin' /> : null}
          {t('verify')}
        </Button>

        <Flex gap={2} className='justify-center'>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            disabled={isPending}
            onClick={() => {
              setStep('request');
              setCode('');
              setError(null);
            }}
          >
            {t('changeIdentifier')}
          </Button>
          <Button type='button' variant='ghost' size='sm' disabled={isPending} onClick={sendCode}>
            {t('resend')}
          </Button>
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex direction='column' gap={6}>
      {error ? (
        <Typography.Text className='text-sm text-red-500' data-testid='otp-form-error'>
          {error}
        </Typography.Text>
      ) : null}

      <Flex direction='column' gap={2}>
        <Label htmlFor='otp-identifier'>{t('identifierLabel')}</Label>
        <div className='relative' dir='ltr'>
          <IconMail className='text-muted-foreground absolute start-3 top-1/2 size-5 -translate-y-1/2' />
          <Input
            id='otp-identifier'
            type='text'
            dir='ltr'
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            placeholder={t('identifierPlaceholder')}
            className='h-12 ps-10'
            disabled={isPending}
            autoComplete='username'
          />
        </div>
        <Typography.Muted className='text-xs'>{t('identifierHint')}</Typography.Muted>
      </Flex>

      <Button
        type='button'
        className='h-12 w-full'
        disabled={isPending || !identifier.trim()}
        onClick={sendCode}
        data-testid='otp-send-submit'
      >
        {isPending ? <IconLoader2 className='me-2 size-4 animate-spin' /> : null}
        {t('sendCode')}
      </Button>
    </Flex>
  );
}
