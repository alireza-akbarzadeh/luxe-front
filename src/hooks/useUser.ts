'use client';

import { useAuth } from '@/components/providers/auth-provider';

/** @deprecated Prefer `useAuth()` directly — kept for backward compatibility. */
export function useUser() {
  const { user, isLoading, isAuthenticated, refreshUser } = useAuth();

  return {
    user,
    loading: isLoading,
    isAuthenticated,
    refreshUser
  };
}
