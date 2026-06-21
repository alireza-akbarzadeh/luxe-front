import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  clearClientAccessToken,
  ensureClientAccessToken,
  getClientAccessToken,
  setClientAccessToken
} from '@/lib/auth/auth-token-client';

import { createJwtExpiringIn } from '../utils/jwt';

describe('auth-token-client', () => {
  beforeEach(() => {
    clearClientAccessToken();
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    clearClientAccessToken();
  });

  it('stores and reads the in-memory access token', () => {
    const token = createJwtExpiringIn(10 * 60_000);
    setClientAccessToken(token);

    expect(getClientAccessToken()).toBe(token);
  });

  it('clears token and in-flight refresh promise', () => {
    setClientAccessToken(createJwtExpiringIn(10 * 60_000));
    clearClientAccessToken();

    expect(getClientAccessToken()).toBeNull();
  });

  it('returns cached token without fetching when still valid', async () => {
    const token = createJwtExpiringIn(10 * 60_000);
    setClientAccessToken(token);

    const result = await ensureClientAccessToken();

    expect(result).toBe(token);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('fetches a fresh token when cache is empty', async () => {
    const freshToken = createJwtExpiringIn(10 * 60_000);
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ access_token: freshToken }), { status: 200 })
    );

    const result = await ensureClientAccessToken();

    expect(fetch).toHaveBeenCalledWith('/api/auth/token', {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store'
    });
    expect(result).toBe(freshToken);
    expect(getClientAccessToken()).toBe(freshToken);
  });

  it('deduplicates concurrent refresh requests', async () => {
    const freshToken = createJwtExpiringIn(10 * 60_000);
    let resolveFetch!: (value: Response) => void;

    vi.mocked(fetch).mockImplementationOnce(
      () =>
        new Promise<Response>((resolve) => {
          resolveFetch = resolve;
        })
    );

    const first = ensureClientAccessToken();
    const second = ensureClientAccessToken();

    resolveFetch(new Response(JSON.stringify({ access_token: freshToken }), { status: 200 }));

    const [a, b] = await Promise.all([first, second]);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(a).toBe(freshToken);
    expect(b).toBe(freshToken);
  });

  it('returns null when the BFF token route fails', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 401 }));

    expect(await ensureClientAccessToken()).toBeNull();
    expect(getClientAccessToken()).toBeNull();
  });

  it('refetches when cached token is expired', async () => {
    setClientAccessToken(createJwtExpiringIn(5_000));
    const freshToken = createJwtExpiringIn(10 * 60_000);

    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ access_token: freshToken }), { status: 200 })
    );

    expect(await ensureClientAccessToken()).toBe(freshToken);
    expect(fetch).toHaveBeenCalledOnce();
  });
});
