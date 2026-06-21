import { defaultLocale, type Locale, localeCookieName, resolveLocale } from '@/i18n/config';

/** Read locale from the `locale` cookie in the browser. */
export function getClientLocaleFromCookie(): Locale {
  if (typeof document === 'undefined') {
    return defaultLocale;
  }

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${localeCookieName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}=([^;]*)`)
  );

  return resolveLocale(match?.[1]);
}

/** Resolve locale for the current request (server) or browser session (client). */
export async function getRequestLocale(): Promise<Locale> {
  if (typeof window !== 'undefined') {
    return getClientLocaleFromCookie();
  }

  const { cookies, headers } = await import('next/headers');
  const cookieStore = await cookies();
  const headerStore = await headers();

  return resolveLocale(
    cookieStore.get(localeCookieName)?.value,
    headerStore.get('accept-language')
  );
}

/** BCP 47 tag sent to the Luxe API (`Accept-Language` header). */
export function localeToAcceptLanguage(locale: Locale): string {
  return locale;
}
