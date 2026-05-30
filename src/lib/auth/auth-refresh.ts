import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';

import type { DtoRefreshResponse } from '@/services/-auth-refresh-post.schemas';

import { BASE_URL } from '../api/api-client';
import { APP_CONFIG } from '../config';
import { AUTH_COOKIE_OPTIONS } from './auth-cookies';

export type RefreshedTokens = {
  accessToken: string;
  refreshToken?: string;
};

const TOKEN_EXPIRY_BUFFER_MS = 30_000;

export function isAccessTokenExpired(token: string, bufferMs = TOKEN_EXPIRY_BUFFER_MS): boolean {
  try {
    const decoded = jwtDecode<{ exp?: number }>(token);
    return (decoded.exp ?? 0) * 1000 < Date.now() + bufferMs;
  } catch {
    return true;
  }
}

/**
 * Call the backend refresh endpoint. Does not read or write cookies.
 */
export async function requestTokenRefresh(refreshToken: string): Promise<RefreshedTokens | null> {
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
      cache: 'no-store'
    });

    if (!res.ok) {
      return null;
    }

    const json = (await res.json()) as DtoRefreshResponse;

    if (!json.success || !json.data?.access_token) {
      return null;
    }

    return {
      accessToken: json.data.access_token,
      refreshToken: json.data.refresh_token
    };
  } catch (error) {
    console.error('[auth] Token refresh request failed:', error);
    return null;
  }
}

/**
 * Refresh session using the refresh_token cookie and persist new tokens.
 */
export async function refreshSessionFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refresh_token')?.value;

  if (!refreshToken) {
    return null;
  }

  const tokens = await requestTokenRefresh(refreshToken);

  if (!tokens) {
    return null;
  }

  cookieStore.set('access_token', tokens.accessToken, {
    ...AUTH_COOKIE_OPTIONS,
    maxAge: APP_CONFIG.accessToken.defaultMaxAge
  });

  if (tokens.refreshToken) {
    cookieStore.set('refresh_token', tokens.refreshToken, {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: APP_CONFIG.refreshToken.maxAge
    });
  }

  return tokens.accessToken;
}
