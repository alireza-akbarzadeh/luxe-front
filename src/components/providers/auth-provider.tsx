'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo
} from 'react';

import { getClientUser } from '@/actions/users.actions';
import type { UserPayload } from '@/lib/auth/auth-server';
import { bootstrapAuthSession, clearClientAccessToken } from '@/lib/auth/auth-session';
import { AUTH_SESSION_CHANGED_EVENT } from '@/lib/auth/auth-session-events';

import { AuthSessionManager } from '../auth/auth-session-manager';

export const AUTH_USER_QUERY_KEY = ['auth', 'user'] as const;

interface AuthContextValue {
  user: UserPayload | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
  clearSession: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const pathname = usePathname();

  const {
    data: user,
    isLoading,
    refetch
  } = useQuery({
    queryKey: AUTH_USER_QUERY_KEY,
    queryFn: () => getClientUser(),
    staleTime: 0,
    refetchOnMount: 'always',
    retry: false
  });

  const refreshUser = useCallback(async () => {
    await bootstrapAuthSession();
    await queryClient.invalidateQueries({ queryKey: AUTH_USER_QUERY_KEY });
    await refetch();
  }, [queryClient, refetch]);

  const clearSession = useCallback(() => {
    clearClientAccessToken();
    queryClient.setQueryData(AUTH_USER_QUERY_KEY, null);
  }, [queryClient]);

  useEffect(() => {
    void refreshUser();
  }, [pathname, refreshUser]);

  useEffect(() => {
    const onSessionChanged = () => {
      void refreshUser();
    };

    window.addEventListener(AUTH_SESSION_CHANGED_EVENT, onSessionChanged);
    return () => window.removeEventListener(AUTH_SESSION_CHANGED_EVENT, onSessionChanged);
  }, [refreshUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: user ?? null,
      isLoading,
      isAuthenticated: Boolean(user),
      refreshUser,
      clearSession
    }),
    [user, isLoading, refreshUser, clearSession]
  );

  return (
    <AuthContext.Provider value={value}>
      <AuthSessionManager />
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
