import type { NextResponse } from 'next/server';

import { APP_CONFIG } from '../config';

export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/'
} as const;

export function applyAuthCookiesToResponse(
  response: NextResponse,
  accessToken: string,
  refreshToken?: string,
  rememberMe = false
) {
  const accessMaxAge = rememberMe
    ? APP_CONFIG.accessToken.rememberMeMaxAge
    : APP_CONFIG.accessToken.defaultMaxAge;

  response.cookies.set('access_token', accessToken, {
    ...AUTH_COOKIE_OPTIONS,
    maxAge: accessMaxAge
  });

  if (refreshToken) {
    response.cookies.set('refresh_token', refreshToken, {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: APP_CONFIG.refreshToken.maxAge
    });
  }

  return response;
}

export function clearAuthCookiesOnResponse(response: NextResponse) {
  for (const name of ['access_token', 'refresh_token'] as const) {
    response.cookies.set(name, '', {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: 0
    });
  }

  return response;
}
