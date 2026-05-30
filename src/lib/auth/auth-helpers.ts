import { cookies } from 'next/headers';

import { AUTH_COOKIE_OPTIONS } from './auth-cookies';
import { APP_CONFIG } from '../config';

/**
 * Set authentication cookies (access token and refresh token)
 */
export async function setAuthCookies(
  accessToken: string,
  refreshToken: string,
  rememberMe = false
) {
  const cookieStore = await cookies();

  const accessMaxAge = rememberMe
    ? APP_CONFIG.accessToken.rememberMeMaxAge
    : APP_CONFIG.accessToken.defaultMaxAge;

  cookieStore.set('access_token', accessToken, {
    ...AUTH_COOKIE_OPTIONS,
    maxAge: accessMaxAge
  });

  cookieStore.set('refresh_token', refreshToken, {
    ...AUTH_COOKIE_OPTIONS,
    maxAge: APP_CONFIG.refreshToken.maxAge
  });
}

/**
 * Clear all authentication cookies
 */
export async function clearAuthCookies() {
  const cookieStore = await cookies();

  cookieStore.delete('access_token');
  cookieStore.delete('refresh_token');
}

/**
 * Get current access token from cookies
 */
export async function getAccessTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('access_token')?.value || null;
}

/**
 * Get current refresh token from cookies
 */
export async function getRefreshTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('refresh_token')?.value || null;
}
