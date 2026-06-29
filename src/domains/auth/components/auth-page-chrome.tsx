'use client';

import { usePathname } from 'next/navigation';
import type { PropsWithChildren } from 'react';

import { AuthBackButton } from './auth-back-button';
import { AuthLanguageSwitcher } from './auth-language-switcher';

const FALLBACK_BY_PATH: Record<string, string> = {
  '/login': '/',
  '/register': '/',
  '/forgot-password': '/login',
  '/reset-password': '/login',
  '/verify-email': '/login',
  '/welcome': '/'
};

/** Shared chrome for guest auth routes: back control + locale switcher. */
export function AuthPageChrome({ children }: Readonly<PropsWithChildren>) {
  const pathname = usePathname();
  const fallbackHref = FALLBACK_BY_PATH[pathname] ?? '/';

  return (
    <>
      <AuthBackButton fallbackHref={fallbackHref} />
      <AuthLanguageSwitcher />
      {children}
    </>
  );
}
