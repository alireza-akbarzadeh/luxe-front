'use client';

import { useFormatter, useLocale } from 'next-intl';

import type { Locale } from '@/i18n/config';

import {
  formatLocaleCurrency,
  formatLocaleDecimal,
  formatLocaleNumber
} from './format-number';

/** Shared typography for currency values (avoid display serif on numbers). */
export const localeMoneyClassName = 'font-sans tabular-nums tracking-tight';

/**
 * Locale-aware number/currency formatters for client components.
 * Prefer next-intl ICU messages for labeled copy; use these for raw values.
 */
export function useLocaleFormatters() {
  const locale = useLocale() as Locale;
  const intlFormatter = useFormatter();

  const formatPrice = (value?: number | null): string => {
    if (value == null || Number.isNaN(value)) {
      return formatLocaleCurrency(0, locale);
    }
    return formatLocaleCurrency(value, locale);
  };

  const formatDecimal = (value: number, fractionDigits = 1): string =>
    formatLocaleDecimal(value, locale, fractionDigits);

  const formatInteger = (value: number): string =>
    formatLocaleNumber(value, locale, { maximumFractionDigits: 0 });

  const formatPercentWhole = (percent: number): string =>
    intlFormatter.number(percent / 100, 'percentWhole');

  return {
    locale,
    formatPrice,
    formatDecimal,
    formatInteger,
    formatPercentWhole,
    moneyClassName: localeMoneyClassName
  };
}
