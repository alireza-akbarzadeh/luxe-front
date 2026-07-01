'use client';

import { useLocale } from 'next-intl';

import type { Locale } from '@/i18n/config';
import { getNavMenusQueryKey } from '@/domains/menus/lib/nav-menus-query-key';
import { useGetNavMenus } from '@/services/-nav-menus-get';

/** Storefront nav menus — labels resolved server-side via Accept-Language. */
export function useNavMenus() {
  const locale = useLocale() as Locale;

  return useGetNavMenus({
    query: {
      queryKey: getNavMenusQueryKey(locale),
      staleTime: 5 * 60 * 1000
    }
  });
}
