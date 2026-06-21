export const locales = ['en', 'es', 'fa'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeCookieName = 'locale';

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  fa: 'فارسی'
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getDirection(locale: Locale): 'ltr' | 'rtl' {
  return locale === 'fa' ? 'rtl' : 'ltr';
}

export function resolveLocale(cookieValue?: string, acceptLanguage?: string | null): Locale {
  if (cookieValue && isLocale(cookieValue)) {
    return cookieValue;
  }

  if (acceptLanguage) {
    const tags = acceptLanguage
      .split(',')
      .map((part) => part.trim().split(';')[0]?.toLowerCase())
      .filter(Boolean);

    for (const tag of tags) {
      const base = tag?.split('-')[0];
      if (base && isLocale(base)) {
        return base;
      }
    }
  }

  return defaultLocale;
}
