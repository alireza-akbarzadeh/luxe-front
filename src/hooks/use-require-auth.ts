'use client';

import { useAuth } from '@/components/providers/auth-provider';
import { useAuthDialogStore } from '@/stores/auth-dialog-store';

type RequireAuthOptions = {
  callbackUrl?: string;
  reason?: string;
};

/**
 * Soft auth gate for storefront actions (add to cart, like, gift cards).
 * Opens the global auth dialog instead of hard-navigating to `/login`.
 * Protected routes still redirect via middleware to the full login page.
 */
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const openAuthDialog = useAuthDialogStore((state) => state.openAuthDialog);

  const requireAuth = (options?: RequireAuthOptions): boolean => {
    if (isAuthenticated) return true;
    openAuthDialog({
      callbackUrl: options?.callbackUrl,
      reason: options?.reason
    });
    return false;
  };

  return { isAuthenticated, isLoading, requireAuth, openAuthDialog };
}
