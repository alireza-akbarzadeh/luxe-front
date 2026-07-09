'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';

import { useAdminNavPreferences } from '@/domains/admin/hooks/use-admin-nav-preferences';

const TRACKABLE_PREFIX = '/dashboard';

/** Records recently visited admin pages and syncs them to nav preferences. */
export function useAdminRecentPages(pageLabel?: string) {
  const pathname = usePathname();
  const { recent, favorites, savePreferences, isLoading } = useAdminNavPreferences();
  const lastTrackedRef = useRef<string | null>(null);

  const trackPage = useCallback(async () => {
    if (!pageLabel || !pathname.startsWith(TRACKABLE_PREFIX)) return;

    const nextRecent = [
      {
        href: pathname,
        label: pageLabel,
        visited_at: new Date().toISOString()
      },
      ...recent.filter((item) => item.href !== pathname)
    ].slice(0, 10);

    await savePreferences({
      favorites,
      recent: nextRecent
    });
  }, [favorites, pageLabel, pathname, recent, savePreferences]);

  useEffect(() => {
    if (isLoading || !pageLabel || !pathname.startsWith(TRACKABLE_PREFIX)) return;
    if (pathname === lastTrackedRef.current) return;
    lastTrackedRef.current = pathname;
    void trackPage();
  }, [isLoading, pageLabel, pathname, trackPage]);
}

/** Resolves a human-readable label for the current admin route. */
export function resolveAdminPageLabel(pathname: string): string | undefined {
  if (pathname === '/dashboard') return 'Dashboard';
  const segments = pathname.replace('/dashboard/', '').split('/');
  const head = segments[0]?.replace(/-/g, ' ');
  if (!head) return undefined;
  return head.charAt(0).toUpperCase() + head.slice(1);
}
