import type { Locale } from '@/i18n/config';

/** BCP 47 tags used by `Intl` — ensures Persian (Eastern Arabic) digits for `fa`. */
const intlLocales: Record<Locale, string> = {
  en: 'en-US',
  es: 'es-ES',
  fa: 'fa-IR'
};

export function getIntlLocale(locale: Locale): string {
  return intlLocales[locale];
}

export function formatLocaleNumber(
  value: number,
  locale: Locale,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(getIntlLocale(locale), options).format(value);
}

export function formatLocaleDecimal(value: number, locale: Locale, fractionDigits = 1): string {
  return formatLocaleNumber(value, locale, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  });
}

/** Whole-number percent, e.g. `0.1` → 10% / ۱۰٪ */
export function formatLocalePercent(value: number, locale: Locale): string {
  return formatLocaleNumber(value, locale, {
    style: 'percent',
    maximumFractionDigits: 0
  });
}

export function formatLocaleCurrency(value: number, locale: Locale, currency = 'USD'): string {
  return formatLocaleNumber(value, locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  });
}

/** Compact stat labels, e.g. 50_000 → 50K / ۵۰ هزار */
export function formatLocaleCompact(value: number, locale: Locale): string {
  return formatLocaleNumber(value, locale, {
    notation: 'compact',
    maximumFractionDigits: value >= 10_000 ? 0 : 1
  });
}

/** Two-digit countdown segment, e.g. 07 → ۰۷ in Persian. */
export function formatLocaleCountdownUnit(value: number, locale: Locale): string {
  return formatLocaleNumber(value, locale, {
    minimumIntegerDigits: 2,
    maximumFractionDigits: 0
  });
}
