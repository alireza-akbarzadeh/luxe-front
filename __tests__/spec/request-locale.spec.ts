import { describe, expect, it } from 'vitest';

import { defaultLocale, localeCookieName } from '@/i18n/config';
import {
  getClientLocaleFromCookie,
  localeToAcceptLanguage
} from '@/lib/i18n/request-locale';

describe('request-locale', () => {
  it('maps locale to Accept-Language tag', () => {
    expect(localeToAcceptLanguage('en')).toBe('en');
    expect(localeToAcceptLanguage('fa')).toBe('fa');
  });

  it('reads locale from document cookie in the browser', () => {
    const previous = document.cookie;
    document.cookie = `${localeCookieName}=es; path=/`;

    expect(getClientLocaleFromCookie()).toBe('es');

    document.cookie = previous;
  });

  it('defaults when cookie is missing', () => {
    const previous = document.cookie;
    document.cookie = `${localeCookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;

    expect(getClientLocaleFromCookie()).toBe(defaultLocale);

    document.cookie = previous;
  });
});
