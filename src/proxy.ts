import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';
import type { DtoRefreshResponse } from './services/-auth-refresh-post.schemas';

/**
 * @typedef {Object} JwtPayload
 * @property {number} exp
 * @property {string} user_id
 * @property {string} [role]
 */

// Routes that require authentication
const protectedRoutes = ['/account', '/orders', '/profile', '/wishlist', '/checkout'];

// Routes that should redirect to account if already authenticated
const authRoutes = ['/login', '/register'];

// Admin routes (if needed)
const adminRoutes = ['/admin'];

// Base URL for API calls - use environment variable
const BASE_URL = process.env['NEXT_PUBLIC_API_URL'] || '"http://localhost:8080/api/v1';

/**
 * Check if a JWT token is expired
 * @param {string} token
 * @returns {boolean}
 */
function isTokenExpired(token: string) {
  try {
    const decoded = jwtDecode(token);
    // Add 10 second buffer to handle clock skew
    return (decoded?.exp ?? 0) * 1000 < Date.now() + 10000;
  } catch {
    return true;
  }
}

/**
 * Decode JWT token safely
 * @param {string} token
 * @returns {JwtPayload | null}
 */
function decodeToken(token: string) {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}

/**
 * Refresh the access token using the refresh token
 * @param {string} refreshToken
 * @returns {Promise<{accessToken: string, refreshToken?: string} | null>}
 */
async function refreshAccessToken(refreshToken: string) {
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken })
    });

    if (!res.ok) {
      console.error('[proxy] Refresh token request failed:', res.status);
      return null;
    }

    const json = (await res.json()) as DtoRefreshResponse;

    if (!json?.success || !json.data?.access_token) {
      console.error('[proxy] Invalid refresh response:', json.message);
      return null;
    }

    return {
      accessToken: json.data.access_token,
      // Some APIs also return a new refresh token (token rotation)
      refreshToken: json.data.refresh_token
    };
  } catch (error) {
    console.error('[proxy] Token refresh error:', error);
    return null;
  }
}

/**
 * Create a redirect response with cleared auth cookies
 * @param {URL} url
 * @returns {NextResponse}
 */
function createLogoutRedirect(url: URL) {
  const response = NextResponse.redirect(url);

  // Clear both tokens
  response.cookies.set('access_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  });

  response.cookies.set('refresh_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  });

  return response;
}

/**
 * Create a response with updated auth cookies
 * @param {NextResponse} response
 * @param {string} accessToken
 * @param {string} [refreshToken]
 * @returns {NextResponse}
 */
function setAuthCookies(response: any, accessToken: string, refreshToken: string) {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  };

  response.cookies.set('access_token', accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 // 15 minutes
  });

  if (refreshToken) {
    response.cookies.set('refresh_token', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });
  }

  return response;
}

/**
 * @param {import('next/server').NextRequest} request
 * @returns {Promise<NextResponse>}
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  // Handle protected routes
  if (isProtectedRoute || isAdminRoute) {
    // No tokens at all - redirect to login
    if (!accessToken && !refreshToken) {
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }

    // Check if access token is valid
    const accessTokenValid = accessToken && !isTokenExpired(accessToken);

    // Access token is valid - proceed
    if (accessTokenValid) {
      // For admin routes, check role
      if (isAdminRoute) {
        const decoded = decodeToken(accessToken);
        if (decoded?.role !== 'admin') {
          return NextResponse.redirect(new URL('/unauthorized', request.url));
        }
      }
      return NextResponse.next();
    }

    // Access token expired or missing, but we have refresh token - try to refresh
    if (refreshToken) {
      const tokens = await refreshAccessToken(refreshToken);

      if (tokens) {
        // Refresh successful - set new cookies and continue
        const response = NextResponse.next();
        setAuthCookies(response, tokens.accessToken, tokens?.refreshToken || '');

        // For admin routes, verify role with new token
        if (isAdminRoute) {
          const decoded = decodeToken(tokens.accessToken);
          if (decoded?.role !== 'admin') {
            return NextResponse.redirect(new URL('/unauthorized', request.url));
          }
        }

        return response;
      }

      // Refresh failed - clear cookies and redirect to login
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return createLogoutRedirect(url);
    }

    // No refresh token and access token is invalid
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return createLogoutRedirect(url);
  }

  // Handle auth routes (login/register) - redirect if already authenticated
  if (isAuthRoute) {
    // Check if user has valid access token
    if (accessToken && !isTokenExpired(accessToken)) {
      return NextResponse.redirect(new URL('/account', request.url));
    }

    // Try to refresh if we have a refresh token
    if (refreshToken && (!accessToken || isTokenExpired(accessToken))) {
      const tokens = await refreshAccessToken(refreshToken);

      if (tokens) {
        // User is authenticated - redirect to account with new cookies
        const response = NextResponse.redirect(new URL('/account', request.url));
        setAuthCookies(response, tokens.accessToken, tokens?.refreshToken || '');
        return response;
      }

      // Refresh failed - clear invalid cookies and let them access auth routes
      const response = NextResponse.next();
      response.cookies.set('access_token', '', { maxAge: 0, path: '/' });
      response.cookies.set('refresh_token', '', { maxAge: 0, path: '/' });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)'
  ]
};
