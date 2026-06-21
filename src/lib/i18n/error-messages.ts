import { defaultLocale, type Locale } from '@/i18n/config';

import en from '../../../messages/en.json';
import es from '../../../messages/es.json';
import fa from '../../../messages/fa.json';

export type ErrorMessageKey = keyof typeof en.errors;

const catalogs: Record<Locale, (typeof en)['errors']> = {
  en: en.errors,
  es: es.errors,
  fa: fa.errors
};

/** Client-side API error copy for toasts when the server sends no message body. */
export function getErrorMessages(locale: Locale = defaultLocale) {
  return catalogs[locale] ?? catalogs.en;
}

/** Interpolate `{name}` placeholders in error message templates. */
export function formatErrorMessage(
  template: string,
  values: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    key in values ? String(values[key]) : `{${key}}`
  );
}
