import { describe, expect, it } from 'vitest';

import {
  defaultLocale,
  getDirection,
  isLocale,
  localeLabels,
  resolveLocale
} from '@/i18n/config';

describe('i18n config', () => {
  it('defaults to English', () => {
    expect(defaultLocale).toBe('en');
    expect(resolveLocale(undefined, undefined)).toBe('en');
  });

  it('resolves supported locales from cookie and Accept-Language', () => {
    expect(resolveLocale('es', undefined)).toBe('es');
    expect(resolveLocale(undefined, 'fa-IR,fa;q=0.9,en;q=0.8')).toBe('fa');
    expect(resolveLocale(undefined, 'de-DE,de;q=0.9')).toBe('en');
  });

  it('validates locale codes and text direction', () => {
    expect(isLocale('en')).toBe(true);
    expect(isLocale('fr')).toBe(false);
    expect(getDirection('fa')).toBe('rtl');
    expect(getDirection('es')).toBe('ltr');
    expect(localeLabels.fa).toBe('فارسی');
  });
});
