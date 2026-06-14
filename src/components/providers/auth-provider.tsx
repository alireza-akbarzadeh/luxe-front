'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
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

  useEffect(() => {
    void bootstrapAuthSession();
  }, []);

  const {
    data: user,
    isLoading,
    refetch
  } = useQuery({
    queryKey: AUTH_USER_QUERY_KEY,
    queryFn: () => getClientUser(),
    staleTime: 60_000,
    retry: false
  });

  const refreshUser = useCallback(async () => {
    await bootstrapAuthSession();
    await refetch();
  }, [refetch]);

  const clearSession = useCallback(() => {
    clearClientAccessToken();
    queryClient.setQueryData(AUTH_USER_QUERY_KEY, null);
  }, [queryClient]);

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
