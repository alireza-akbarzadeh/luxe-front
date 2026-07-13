'use client';

import { parseAsString, useQueryState } from 'nuqs';

import { WISHLIST_SHARE_QUERY_KEY } from '@/domains/wishlist/lib/wishlist-share';

/** Reads / clears the wishlist share code from the URL (`?share=`). */
export function useWishlistShareQuery() {
  return useQueryState(WISHLIST_SHARE_QUERY_KEY, parseAsString);
}
