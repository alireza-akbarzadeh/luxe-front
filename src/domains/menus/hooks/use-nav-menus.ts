'use client';

import { useLocale } from 'next-intl';

import type { Locale } from '@/i18n/config';
import { getGetNavMenusQueryKey, useGetNavMenus } from '@/services/-nav-menus-get';

/** TanStack Query key scoped by locale so nav refetches after language switch. */
export function getNavMenusQueryKey(locale: Locale) {
  return [...getGetNavMenusQueryKey(), locale] as const;
}

/** Storefront nav menus — labels resolved server-side via Accept-Language. */
export function useNavMenus() {
  const locale = useLocale() as Locale;

  return useGetNavMenus({
    query: {
      queryKey: getNavMenusQueryKey(locale)
    }
  });
}
