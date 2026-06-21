import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  getAccessTokenRefreshDelayMs,
  shouldRefreshAccessToken
} from '@/lib/auth/auth-session';

import { createJwtExpiringIn, createMockJwt } from '../utils/jwt';

describe('getAccessTokenRefreshDelayMs', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-21T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('schedules refresh 60 seconds before expiry', () => {
    const token = createMockJwt({ exp: Math.floor(Date.now() / 1000) + 300 });
    expect(getAccessTokenRefreshDelayMs(token)).toBe(240_000);
  });

  it('returns 0 when refresh time is already past', () => {
    const token = createJwtExpiringIn(30_000);
    expect(getAccessTokenRefreshDelayMs(token)).toBe(0);
  });

  it('returns null for invalid tokens', () => {
    expect(getAccessTokenRefreshDelayMs('invalid')).toBeNull();
  });

  it('returns null when exp is missing', () => {
    expect(getAccessTokenRefreshDelayMs(createMockJwt({ sub: '1' }))).toBeNull();
  });
});

describe('shouldRefreshAccessToken', () => {
  it('requires refresh when token is null', () => {
    expect(shouldRefreshAccessToken(null)).toBe(true);
  });

  it('requires refresh when token is near expiry (60s buffer)', () => {
    expect(shouldRefreshAccessToken(createJwtExpiringIn(30_000))).toBe(true);
  });

  it('does not refresh a token with plenty of lifetime left', () => {
    expect(shouldRefreshAccessToken(createJwtExpiringIn(10 * 60_000))).toBe(false);
  });
});
