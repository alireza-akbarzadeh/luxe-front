'use client';

import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import { useCallback } from 'react';

import type { DtoMenuItemResponse } from '@/services/-user-menu-structure-get.schemas';

/** Stable key for a parent nav item in the `?nav=` URL param. */
export function getMenuItemNavKey(item: DtoMenuItemResponse): string {
  return (item.href || item.label || 'item').replace(/^\//, '').replace(/\//g, '-') || 'item';
}

/**
 * Persists expanded sidebar sections in `?nav=` (comma-separated keys).
 * Example: /dashboard/orders?nav=commerce-orders
 */
export function useAdminSidebarNav() {
  const [expandedKeys, setExpandedKeys] = useQueryState(
    'nav',
    parseAsArrayOf(parseAsString).withDefault([])
  );

  const isExpanded = useCallback(
    (key: string, hasActiveChild: boolean) => hasActiveChild || expandedKeys.includes(key),
    [expandedKeys]
  );

  const setExpanded = useCallback(
    (key: string, open: boolean) => {
      setExpandedKeys((current) => {
        const next = new Set(current ?? []);
        if (open) next.add(key);
        else next.delete(key);
        return Array.from(next);
      });
    },
    [setExpandedKeys]
  );

  const toggleExpanded = useCallback(
    (key: string, hasActiveChild: boolean) => {
      const currentlyOpen = isExpanded(key, hasActiveChild);
      if (hasActiveChild && currentlyOpen) return;
      setExpanded(key, !currentlyOpen);
    },
    [isExpanded, setExpanded]
  );

  return { expandedKeys, isExpanded, setExpanded, toggleExpanded };
}
