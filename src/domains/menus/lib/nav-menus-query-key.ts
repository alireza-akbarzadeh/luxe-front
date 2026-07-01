import type { Locale } from '@/i18n/config';
import { getGetNavMenusQueryKey } from '@/services/-nav-menus-get';

/** TanStack Query key scoped by locale so nav refetches after language switch. */
export function getNavMenusQueryKey(locale: Locale) {
  return [...getGetNavMenusQueryKey(), locale] as const;
}
