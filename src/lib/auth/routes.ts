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
    '/compare',
    '/notifications',
    '/dashboard',
    '/order-tracking',
    '/vendor/panel'
  ],
  guestOnly: ['/login', '/register', '/forgot-password', '/vendor/login'],
  publicAuth: ['/reset-password', '/verify-email'],
  admin: ['/dashboard']
} as const;

export function isProtectedPath(pathname: string): boolean {
  return AUTH_ROUTES.protected.some((route) => pathname.startsWith(route));
}

export function isGuestOnlyAuthPath(pathname: string): boolean {
  return AUTH_ROUTES.guestOnly.some((route) => pathname.startsWith(route));
}

export function isPublicAuthPath(pathname: string): boolean {
  return AUTH_ROUTES.publicAuth.some((route) => pathname.startsWith(route));
}

/** Guest-only auth pages (login, register, forgot password). */
export function isAuthPath(pathname: string): boolean {
  return isGuestOnlyAuthPath(pathname);
}

export function isAdminPath(pathname: string): boolean {
  return AUTH_ROUTES.admin.some((route) => pathname.startsWith(route));
}

export function isVendorPanelPath(pathname: string): boolean {
  return pathname.startsWith('/vendor/panel');
}

export function isVendorLoginPath(pathname: string): boolean {
  return pathname.startsWith('/vendor/login');
}
