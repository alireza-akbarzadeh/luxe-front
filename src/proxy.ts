import { jwtDecode } from 'jwt-decode';
import { NextRequest, NextResponse } from 'next/server';

import { applyAuthCookiesToResponse, clearAuthCookiesOnResponse } from './lib/auth-cookies';
import { isAccessTokenExpired, requestTokenRefresh } from './lib/auth-refresh';

const protectedRoutes = ['/account', '/orders', '/profile', '/wishlist', '/checkout'];
const authRoutes = ['/login', '/register'];
const adminRoutes = ['/admin'];

function decodeToken(token: string) {
  try {
    return jwtDecode<{ role?: string }>(token);
  } catch {
    return null;
  }
}

async function tryRefreshSession(refreshToken: string) {
  return requestTokenRefresh(refreshToken);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  // Silent refresh on any navigation when access token expired but refresh token exists
  let refreshedTokens: Awaited<ReturnType<typeof tryRefreshSession>> | null = null;
  if (refreshToken && (!accessToken || isAccessTokenExpired(accessToken))) {
    refreshedTokens = await tryRefreshSession(refreshToken);
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
        if (decoded?.role !== 'admin') {
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
        if (decoded?.role !== 'admin') {
          return NextResponse.redirect(new URL('/unauthorized', request.url));
        }
      }
      return withRefreshedCookies(NextResponse.next());
    }

    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return clearAuthCookiesOnResponse(NextResponse.redirect(url));
  }

  if (isAuthRoute) {
    if (effectiveAccessToken && !isAccessTokenExpired(effectiveAccessToken)) {
      return withRefreshedCookies(NextResponse.redirect(new URL('/account', request.url)));
    }

    if (refreshedTokens) {
      return withRefreshedCookies(NextResponse.redirect(new URL('/account', request.url)));
    }

    // Expired refresh token on login page — clear stale cookies so user can sign in again
    if (refreshToken && !refreshedTokens) {
      return clearAuthCookiesOnResponse(NextResponse.next());
    }
  }

  return withRefreshedCookies(NextResponse.next());
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)']
};
