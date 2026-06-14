/**
 * In-memory access token for browser API calls.
 * HttpOnly cookies live on the Next.js origin; the Go API runs on a different
 * origin and requires an explicit Authorization header.
 */

import { isAccessTokenExpired } from './auth-jwt';

let accessToken: string | null = null;
let tokenPromise: Promise<string | null> | null = null;

export function getClientAccessToken(): string | null {
  return accessToken;
}

export function setClientAccessToken(token: string | null): void {
  accessToken = token;
}

export function clearClientAccessToken(): void {
  accessToken = null;
  tokenPromise = null;
}

/**
 * Resolve a valid access token for client-side API calls.
 * Reads/refreshes via the Next.js BFF route which owns the httpOnly cookies.
 */
export async function ensureClientAccessToken(): Promise<string | null> {
  if (accessToken && !isAccessTokenExpired(accessToken)) {
    return accessToken;
  }

  accessToken = null;

  if (tokenPromise) {
    return tokenPromise;
  }

  tokenPromise = fetch('/api/auth/token', {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store'
  })
    .then(async (response) => {
      if (!response.ok) {
        accessToken = null;
        return null;
      }

      const data = (await response.json()) as { access_token?: string };
      accessToken = data.access_token ?? null;
      return accessToken;
    })
    .catch(() => {
      accessToken = null;
      return null;
    })
    .finally(() => {
      tokenPromise = null;
    });

  return tokenPromise;
}
