import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp: number;
  user_id: string;
}

// Routes that require authentication
const protectedRoutes = ['/account', '/orders', '/profile', '/wishlist', '/checkout'];

// Routes that should redirect to account if already authenticated
const authRoutes = ['/login', '/register'];

// Admin routes (if needed)
const adminRoutes = ['/admin'];

function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute) {
    if (!accessToken && !refreshToken) {
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }

    if (accessToken && isTokenExpired(accessToken) && !refreshToken) {
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }

    if (accessToken && isTokenExpired(accessToken) && refreshToken) {
      return NextResponse.next();
    }
  }

  // Handle auth routes (login/register) - redirect if already authenticated
  if (isAuthRoute && accessToken && !isTokenExpired(accessToken)) {
    return NextResponse.redirect(new URL('/account', request.url));
  }

  // Handle admin routes (optional - add role check if needed)
  if (isAdminRoute) {
    if (!accessToken || isTokenExpired(accessToken)) {
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }

    const decoded = jwtDecode<JwtPayload & { role: string }>(accessToken);
    if (decoded.role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
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
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)'
  ]
};
