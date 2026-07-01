import { cookies } from 'next/headers';
import { getLocale } from 'next-intl/server';

import { getNavMenusQueryKey } from '@/domains/menus/lib/nav-menus-query-key';
import type { Locale } from '@/i18n/config';
import { getQueryClient } from '@/lib/query-client';
import { getGetNavMenusQueryOptions } from '@/services/-nav-menus-get';

/** Prefetch storefront nav menus for layout hydration — avoids client waterfall on first paint. */
export async function prefetchSiteNavMenus() {
  const [locale, cookieStore] = await Promise.all([getLocale(), cookies()]);
  const queryClient = getQueryClient();
  const cookieHeader = cookieStore.toString();
  const requestOptions = cookieHeader
    ? { request: { headers: { Cookie: cookieHeader } } }
    : undefined;

  await queryClient.prefetchQuery({
    ...getGetNavMenusQueryOptions(requestOptions),
    queryKey: getNavMenusQueryKey(locale as Locale),
    staleTime: 5 * 60 * 1000
  });

  return queryClient;
}
