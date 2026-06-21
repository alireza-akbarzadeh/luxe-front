'use server';

import { cookies } from 'next/headers';

import { isLocale, type Locale, localeCookieName } from '@/i18n/config';

/** Persist storefront language preference in a cookie and refresh the RSC tree. */
export async function setLocale(locale: string): Promise<Locale | null> {
  if (!isLocale(locale)) {
    return null;
  }

  const cookieStore = await cookies();
  cookieStore.set(localeCookieName, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax'
  });

  return locale;
}
