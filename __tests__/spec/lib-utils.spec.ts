import { afterEach, describe, expect, it, vi } from 'vitest';

import { getCallbackUrl, slugify } from '@/lib/utils';

describe('slugify', () => {
  it('lowercases and hyphenates values', () => {
    expect(slugify('  Silk Evening Gown  ')).toBe('silk-evening-gown');
    expect(slugify('Gold & Pearl Earrings!!!')).toBe('gold-pearl-earrings');
  });

  it('strips leading and trailing separators', () => {
    expect(slugify('---Luxury---')).toBe('luxury');
  });
});

describe('getCallbackUrl', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('defaults to /account when callback is missing', () => {
    expect(getCallbackUrl()).toBe('/account');
    expect(getCallbackUrl(null)).toBe('/account');
  });

  it('allows relative paths when app domain matches origin', () => {
    vi.stubEnv('NEXT_PUBLIC_APP_DOMAIN', 'localhost:4000');
    vi.stubEnv('NEXT_PUBLIC_APP_ORIGIN', 'http://localhost:4000');
    expect(getCallbackUrl('/checkout?step=shipping')).toBe('/checkout?step=shipping');
  });

  it('allows absolute URLs on the app origin', () => {
    vi.stubEnv('NEXT_PUBLIC_APP_DOMAIN', 'localhost:4000');
    vi.stubEnv('NEXT_PUBLIC_APP_ORIGIN', 'http://localhost:4000');
    expect(getCallbackUrl('http://localhost:4000/wishlist')).toBe('/wishlist');
  });

  it('rejects external origins and falls back to /account', () => {
    vi.stubEnv('NEXT_PUBLIC_APP_DOMAIN', 'localhost:4000');
    vi.stubEnv('NEXT_PUBLIC_APP_ORIGIN', 'http://localhost:4000');
    expect(getCallbackUrl('https://evil.example/phish')).toBe('/account');
  });

  it('rejects relative paths when domain and origin do not match', () => {
    vi.stubEnv('NEXT_PUBLIC_APP_ORIGIN', 'http://localhost:4000');
    expect(getCallbackUrl('/orders/123')).toBe('/account');
  });
});
