'use client';

import { parseAsString, useQueryState } from 'nuqs';

import { CART_SHARE_QUERY_KEY } from '@/domains/cart/lib/cart-share';

/** Reads / clears the cart share code from the URL (`?share=`). */
export function useCartShareQuery() {
  return useQueryState(CART_SHARE_QUERY_KEY, parseAsString);
}
