'use client';

import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';

import { Flex } from '@/components/ui/flex';
import { getDirection, type Locale } from '@/i18n/config';
import { getCallbackUrl } from '@/lib/utils';

import { AuthBrandPanel } from '../components/auth-brand-panel';
import { LoginFormPanel } from '../components/login-form-panel';

export function LoginDomain() {
  const locale = useLocale() as Locale;
  const pageDir = getDirection(locale);
  const searchParams = useSearchParams();
  const callbackUrl = getCallbackUrl(
    searchParams.get('callbackUrl') ?? searchParams.get('redirect')
  );

  return (
    <Flex direction='row' className='bg-background min-h-screen' dir='ltr'>
      <Flex
        align='center'
        justify='center'
        className='relative flex-1 p-6 pt-16 sm:p-12 sm:pt-14'
        dir={pageDir}
      >
        <LoginFormPanel
          variant='page'
          callbackUrl={callbackUrl}
          showBrandMark
          className='max-w-md'
        />
      </Flex>
      <AuthBrandPanel />
    </Flex>
  );
}
