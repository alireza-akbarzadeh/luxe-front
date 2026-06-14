import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { applyAuthCookiesToResponse, clearAuthCookiesOnResponse } from '@/lib/auth/auth-cookies';
import { requestTokenRefresh } from '@/lib/auth/auth-refresh';

export async function POST(_req: NextRequest) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refresh_token')?.value;

  if (!refreshToken) {
    return clearAuthCookiesOnResponse(
      NextResponse.json({ error: 'Refresh failed' }, { status: 401 })
    );
  }

  const tokens = await requestTokenRefresh(refreshToken);

  if (!tokens) {
    return clearAuthCookiesOnResponse(
      NextResponse.json({ error: 'Refresh failed' }, { status: 401 })
    );
  }

  const response = NextResponse.json({ access_token: tokens.accessToken });
  applyAuthCookiesToResponse(response, tokens.accessToken, tokens.refreshToken);

  return response;
}
