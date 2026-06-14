'use client';

import { useEffect, useRef } from 'react';

import { useAuth } from '@/components/providers/auth-provider';
import {
  bootstrapAuthSession,
  getAccessTokenRefreshDelayMs,
  getClientAccessToken,
  setClientAccessToken,
  shouldRefreshAccessToken
} from '@/lib/auth/auth-session';

/**
 * Proactively refreshes the access token before it expires.
 * Also re-syncs when another browser tab rotates refresh tokens.
 */
export function AuthSessionManager() {
  const { isAuthenticated, clearSession, refreshUser } = useAuth();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    const scheduleRefresh = () => {
      const token = getClientAccessToken();
      if (!token || shouldRefreshAccessToken(token)) {
        void performRefresh();
        return;
      }

      const delay = getAccessTokenRefreshDelayMs(token);
      if (delay === null) return;

      timerRef.current = setTimeout(() => {
        void performRefresh();
      }, delay);
    };

    const performRefresh = async () => {
      try {
        const response = await fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include',
          cache: 'no-store'
        });

        if (response.ok) {
          const data = (await response.json()) as { access_token?: string };
          if (data.access_token) {
            setClientAccessToken(data.access_token);
            await refreshUser();
            scheduleRefresh();
            return;
          }
        }

        if (response.status === 401) {
          const tokenResponse = await fetch('/api/auth/token', {
            credentials: 'include',
            cache: 'no-store'
          });
          if (tokenResponse.ok) {
            const data = (await tokenResponse.json()) as { access_token?: string };
            if (data.access_token) {
              setClientAccessToken(data.access_token);
              await refreshUser();
              scheduleRefresh();
              return;
            }
          }
        }

        clearSession();
      } catch {
        clearSession();
      }
    };

    void bootstrapAuthSession().then(() => scheduleRefresh());

    const onFocus = () => {
      void bootstrapAuthSession().then(() => scheduleRefresh());
    };

    window.addEventListener('focus', onFocus);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener('focus', onFocus);
    };
  }, [isAuthenticated, clearSession, refreshUser]);

  return null;
}
