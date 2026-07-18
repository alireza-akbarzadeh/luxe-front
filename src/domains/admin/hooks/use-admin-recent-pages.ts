'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { useAdminNavPreferences } from '@/domains/admin/hooks/use-admin-nav-preferences';

const TRACKABLE_PREFIX = '/dashboard';

/** Records recently visited admin pages and syncs them to nav preferences. */
export function useAdminRecentPages(pageLabel?: string) {
  const pathname = usePathname();
  const { trackRecentPage, isLoading } = useAdminNavPreferences();
  const lastTrackedRef = useRef<string | null>(null);

  useEffect(() => {
    if (isLoading || !pageLabel || !pathname.startsWith(TRACKABLE_PREFIX)) return;
    if (pathname === lastTrackedRef.current) return;
    lastTrackedRef.current = pathname;
    void trackRecentPage({ href: pathname, label: pageLabel });
  }, [isLoading, pageLabel, pathname, trackRecentPage]);
}

/** Resolves a human-readable label for the current admin route. */
export function resolveAdminPageLabel(pathname: string): string | undefined {
  if (pathname === '/dashboard') return 'Dashboard';
  const segments = pathname.replace('/dashboard/', '').split('/');
  const head = segments[0]?.replace(/-/g, ' ');
  if (!head) return undefined;
  return head.charAt(0).toUpperCase() + head.slice(1);
}
