import {
  type Country,
  isValidPhoneNumber,
  parsePhoneNumber,
  type Value as PhoneInputValue
} from 'react-phone-number-input';

import type { Locale } from '@/i18n/config';

/** Default country for national numbers stored without a + prefix (e.g. from the API). */
export const DEFAULT_PHONE_COUNTRY: Country = 'IR';

const LOCALE_PHONE_COUNTRY: Record<Locale, Country> = {
  en: 'US',
  es: 'ES',
  fa: 'IR'
};

/** Maps storefront locale to the default phone country for new inputs. */
export function resolveDefaultPhoneCountry(locale?: string): Country {
  if (locale && locale in LOCALE_PHONE_COUNTRY) {
    return LOCALE_PHONE_COUNTRY[locale as Locale];
  }
  return DEFAULT_PHONE_COUNTRY;
}

/**
 * Converts API / form phone strings to E.164 for `react-phone-number-input`.
 * Handles Iranian numbers commonly stored as `9381223880` or `09381223880`.
 */
export function normalizePhoneForInput(
  value: string | undefined | null,
  defaultCountry: Country = DEFAULT_PHONE_COUNTRY
): PhoneInputValue | undefined {
  if (value == null) return undefined;

  const trimmed = value.trim();
  if (!trimmed) return undefined;

  const parsedDirect = parsePhoneNumber(trimmed);
  if (parsedDirect?.number) return parsedDirect.number as PhoneInputValue;

  const parsedWithCountry = parsePhoneNumber(trimmed, defaultCountry);
  if (parsedWithCountry?.number) return parsedWithCountry.number as PhoneInputValue;

  const digits = trimmed.replace(/\D/g, '');
  if (!digits) return undefined;

  if (defaultCountry === 'IR') {
    const candidates: string[] = [];

    if (digits.startsWith('98')) {
      candidates.push(`+${digits}`);
    }
    if (digits.startsWith('0') && digits.length >= 10) {
      candidates.push(`+98${digits.slice(1)}`);
    }
    if (digits.startsWith('9') && digits.length === 10) {
      candidates.push(`+98${digits}`);
    }

    for (const candidate of candidates) {
      const parsed = parsePhoneNumber(candidate);
      if (parsed?.number) return parsed.number as PhoneInputValue;
    }
  }

  return undefined;
}

/** Returns a display-safe value for the phone input — never an empty string. */
export function toPhoneInputValue(
  value: string | undefined | null,
  defaultCountry: Country = DEFAULT_PHONE_COUNTRY
): PhoneInputValue | undefined {
  return normalizePhoneForInput(value, defaultCountry);
}

/** Returns E.164 for API payloads, or undefined when empty / not valid. */
export function formatPhoneE164ForApi(
  value: string | undefined | null,
  defaultCountry: Country = DEFAULT_PHONE_COUNTRY
): string | undefined {
  const normalized = normalizePhoneForInput(value, defaultCountry);
  if (!normalized || !isValidPhoneNumber(normalized)) {
    return undefined;
  }
  return normalized;
}

export function isValidPhoneE164(value: string | undefined | null): boolean {
  const trimmed = value?.trim();
  if (!trimmed) return false;
  return isValidPhoneNumber(trimmed);
}
