'use client';

import { LanguageSwitcher } from '@/components/i18n/language-switcher';
import { Flex } from '@/components/ui/flex';

/** Top-right locale control for guest auth pages (login, register, forgot password). */
export function AuthLanguageSwitcher() {
  return (
    <Flex justify='end' className='absolute end-4 top-4 z-20 sm:end-6 sm:top-6'>
      <LanguageSwitcher />
    </Flex>
  );
}
