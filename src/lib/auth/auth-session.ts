import { jwtDecode } from 'jwt-decode';

import { isAccessTokenExpired } from './auth-jwt';
import {
  clearClientAccessToken,
  ensureClientAccessToken,
  getClientAccessToken,
  setClientAccessToken
} from './auth-token-client';

export {
  clearClientAccessToken,
  ensureClientAccessToken,
  getClientAccessToken,
  setClientAccessToken
};

/** Warm the in-memory access token cache on app load. */
export async function bootstrapAuthSession(): Promise<string | null> {
  return ensureClientAccessToken();
}

/** Schedule proactive refresh ~60s before access token expiry. */
export function getAccessTokenRefreshDelayMs(token: string): number | null {
  try {
    const decoded = jwtDecode<{ exp?: number }>(token);
    if (!decoded.exp) return null;

    const expiresAtMs = decoded.exp * 1000;
    const refreshAtMs = expiresAtMs - 60_000;
    const delay = refreshAtMs - Date.now();

    return delay > 0 ? delay : 0;
  } catch {
    return null;
  }
}

export function shouldRefreshAccessToken(token: string | null): boolean {
  if (!token) return true;
  return isAccessTokenExpired(token, 60_000);
}
