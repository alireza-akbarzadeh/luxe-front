import { cookies } from 'next/headers';
import { APP_CONFIG } from './config';

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

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/'
  };

  cookieStore.set('access_token', accessToken, {
    ...cookieOptions,
    maxAge: accessMaxAge
  });

  cookieStore.set('refresh_token', refreshToken, {
    ...cookieOptions,
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
 * Update only the access token cookie
 */
export async function updateAccessToken(accessToken: string, maxAge?: number) {
  const cookieStore = await cookies();

  cookieStore.set('access_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: maxAge || APP_CONFIG.accessToken.defaultMaxAge
  });
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
