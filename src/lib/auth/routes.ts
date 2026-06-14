/**
 * Central auth route configuration for middleware and server guards.
 */

export const AUTH_ROUTES = {
  protected: [
    '/account',
    '/orders',
    '/profile',
    '/wishlist',
    '/checkout',
    '/dashboard',
    '/order-tracking'
  ],
  auth: ['/login', '/register', '/forgot-password'],
  admin: ['/dashboard']
} as const;

export function isProtectedPath(pathname: string): boolean {
  return AUTH_ROUTES.protected.some((route) => pathname.startsWith(route));
}

export function isAuthPath(pathname: string): boolean {
  return AUTH_ROUTES.auth.some((route) => pathname.startsWith(route));
}

export function isAdminPath(pathname: string): boolean {
  return AUTH_ROUTES.admin.some((route) => pathname.startsWith(route));
}
