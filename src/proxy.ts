import { jwtDecode } from 'jwt-decode';
import { NextRequest, NextResponse } from 'next/server';

import { applyAuthCookiesToResponse, clearAuthCookiesOnResponse } from './lib/auth/auth-cookies';
import { isAccessTokenExpired, requestTokenRefresh } from './lib/auth/auth-refresh';
import { isAdminPath, isGuestOnlyAuthPath, isProtectedPath } from './lib/auth/routes';

function decodeToken(token: string) {
  try {
    return jwtDecode<{ role?: string }>(token);
  } catch {
    return null;
  }
}

function isAllowedAdmin(role?: string) {
  return role === 'admin' || role === 'moderator';
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  const isProtectedRoute = isProtectedPath(pathname);
  const isGuestOnlyAuthRoute = isGuestOnlyAuthPath(pathname);
  const isAdminRoute = isAdminPath(pathname);

  let refreshedTokens: Awaited<ReturnType<typeof requestTokenRefresh>> | null = null;
  if (refreshToken && (!accessToken || isAccessTokenExpired(accessToken))) {
    refreshedTokens = await requestTokenRefresh(refreshToken);
  }

  const effectiveAccessToken = refreshedTokens?.accessToken ?? accessToken;

  const withRefreshedCookies = (response: NextResponse) => {
    if (refreshedTokens) {
      applyAuthCookiesToResponse(
        response,
        refreshedTokens.accessToken,
        refreshedTokens.refreshToken
      );
    }
    return response;
  };

  if (isProtectedRoute || isAdminRoute) {
    if (!effectiveAccessToken && !refreshToken) {
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }

    if (effectiveAccessToken && !isAccessTokenExpired(effectiveAccessToken)) {
      if (isAdminRoute) {
        const decoded = decodeToken(effectiveAccessToken);
        if (!isAllowedAdmin(decoded?.role)) {
          return NextResponse.redirect(new URL('/unauthorized', request.url));
        }
      }
      return withRefreshedCookies(NextResponse.next());
    }

    if (refreshToken && !refreshedTokens) {
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return clearAuthCookiesOnResponse(NextResponse.redirect(url));
    }

    if (refreshedTokens) {
      if (isAdminRoute) {
        const decoded = decodeToken(refreshedTokens.accessToken);
        if (!isAllowedAdmin(decoded?.role)) {
          return NextResponse.redirect(new URL('/unauthorized', request.url));
        }
      }
      return withRefreshedCookies(NextResponse.next());
    }

    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return clearAuthCookiesOnResponse(NextResponse.redirect(url));
  }

  if (isGuestOnlyAuthRoute) {
    if (effectiveAccessToken && !isAccessTokenExpired(effectiveAccessToken)) {
      return withRefreshedCookies(NextResponse.redirect(new URL('/account', request.url)));
    }

    if (refreshedTokens) {
      return withRefreshedCookies(NextResponse.redirect(new URL('/account', request.url)));
    }

    if (refreshToken && !refreshedTokens) {
      return clearAuthCookiesOnResponse(NextResponse.next());
    }
  }

  return withRefreshedCookies(NextResponse.next());
}
