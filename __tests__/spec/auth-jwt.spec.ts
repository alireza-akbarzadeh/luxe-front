import { describe, expect, it } from 'vitest';

import { isAccessTokenExpired } from '@/lib/auth/auth-jwt';

import { createJwtExpiringIn, createMockJwt } from '../utils/jwt';

describe('isAccessTokenExpired', () => {
  it('returns false when the token expires well beyond the default buffer', () => {
    const token = createJwtExpiringIn(5 * 60_000);
    expect(isAccessTokenExpired(token)).toBe(false);
  });

  it('returns true when expiry falls inside the 30s buffer', () => {
    const token = createJwtExpiringIn(10_000);
    expect(isAccessTokenExpired(token)).toBe(true);
  });

  it('returns true for malformed tokens', () => {
    expect(isAccessTokenExpired('not-a-jwt')).toBe(true);
  });

  it('returns true when exp claim is missing', () => {
    expect(isAccessTokenExpired(createMockJwt({ sub: 'user-1' }))).toBe(true);
  });

  it('respects a custom buffer', () => {
    const token = createJwtExpiringIn(90_000);
    expect(isAccessTokenExpired(token, 120_000)).toBe(true);
    expect(isAccessTokenExpired(token, 30_000)).toBe(false);
  });
});
