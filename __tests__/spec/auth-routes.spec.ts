import { describe, expect, it } from 'vitest';

import {
  isAdminPath,
  isAuthPath,
  isGuestOnlyAuthPath,
  isProtectedPath,
  isPublicAuthPath,
  isVendorLoginPath,
  isVendorPanelPath
} from '@/lib/auth/routes';

describe('auth route guards', () => {
  describe('isProtectedPath', () => {
    it.each([
      ['/account', true],
      ['/account/orders', true],
      ['/checkout', true],
      ['/checkout/shipping', true],
      ['/dashboard', true],
      ['/dashboard/products', true],
      ['/vendor/panel', true],
      ['/shop', false],
      ['/login', false]
    ])('isProtectedPath(%s) → %s', (path, expected) => {
      expect(isProtectedPath(path)).toBe(expected);
    });
  });

  describe('isGuestOnlyAuthPath', () => {
    it.each([
      ['/login', true],
      ['/register', true],
      ['/forgot-password', true],
      ['/vendor/login', true],
      ['/reset-password', false],
      ['/account', false]
    ])('isGuestOnlyAuthPath(%s) → %s', (path, expected) => {
      expect(isGuestOnlyAuthPath(path)).toBe(expected);
    });
  });

  describe('isPublicAuthPath', () => {
    it.each([
      ['/reset-password', true],
      ['/verify-email', true],
      ['/verify-email?token=abc', true],
      ['/login', false]
    ])('isPublicAuthPath(%s) → %s', (path, expected) => {
      expect(isPublicAuthPath(path)).toBe(expected);
    });
  });

  it('treats guest-only pages as auth paths', () => {
    expect(isAuthPath('/login')).toBe(true);
    expect(isAuthPath('/reset-password')).toBe(false);
  });

  it('identifies admin and vendor routes', () => {
    expect(isAdminPath('/dashboard/reports')).toBe(true);
    expect(isAdminPath('/shop')).toBe(false);

    expect(isVendorPanelPath('/vendor/panel/settings')).toBe(true);
    expect(isVendorPanelPath('/vendor/login')).toBe(false);

    expect(isVendorLoginPath('/vendor/login')).toBe(true);
    expect(isVendorLoginPath('/vendor/panel')).toBe(false);
  });
});
