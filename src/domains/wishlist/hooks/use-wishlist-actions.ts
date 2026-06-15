'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

import { getGetAccountSummaryQueryKey } from '~/src/services/-account-summary-get';
import {
  getGetAccountWishlistQueryKey,
  useGetAccountWishlist
} from '~/src/services/-account-wishlist-get';
import { usePostProductsIdLike } from '~/src/services/-products-{id}-like-post';

import type { SortOption } from '../wishlist.store';

const PAGE_SIZE = 50;

/**
 * Shared wishlist data + remove/clear actions for the full wishlist page.
 */
export function useWishlistActions(sortBy: SortOption, enabled = true) {
  const queryClient = useQueryClient();
  const [removingProductId, setRemovingProductId] = useState<number | null>(null);
  const [isClearing, setIsClearing] = useState(false);

  const query = useGetAccountWishlist(
    {
      limit: PAGE_SIZE,
      offset: 0,
      sort: sortBy
    },
    { query: { enabled } }
  );

  const { mutateAsync: toggleLike } = usePostProductsIdLike();

  const invalidateWishlist = async () => {
    await queryClient.invalidateQueries({ queryKey: getGetAccountWishlistQueryKey() });
    await queryClient.invalidateQueries({ queryKey: getGetAccountSummaryQueryKey() });
  };

  const removeItem = async (productId: number) => {
    setRemovingProductId(productId);
    try {
      await toggleLike({ id: productId, data: { like: false } });
      await invalidateWishlist();
      toast.success('Removed from wishlist');
    } catch {
      toast.error('Failed to remove item');
    } finally {
      setRemovingProductId(null);
    }
  };

  const clearAll = async (productIds: number[]) => {
    if (productIds.length === 0) return;

    setIsClearing(true);
    try {
      await Promise.all(
        productIds.map((productId) => toggleLike({ id: productId, data: { like: false } }))
      );
      await invalidateWishlist();
      toast.success('Wishlist cleared');
    } catch {
      toast.error('Failed to clear wishlist');
    } finally {
      setIsClearing(false);
    }
  };

  return {
    ...query,
    items: query.data?.data?.items ?? [],
    total: query.data?.data?.total ?? 0,
    removingProductId,
    isClearing,
    removeItem,
    clearAll
  };
}
