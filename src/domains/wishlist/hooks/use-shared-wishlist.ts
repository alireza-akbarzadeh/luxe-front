'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

import { getGetAccountSummaryQueryKey } from '@/services/-account-summary-get';
import { getGetAccountWishlistQueryKey } from '@/services/-account-wishlist-get';
import { usePostProductsIdLike } from '@/services/-products-{id}-like-post';
import { useGetProducts } from '@/services/-products-get';

import { decodeWishlistShare, WISHLIST_SHARE_MAX_IDS } from '../lib/wishlist-share';

/**
 * Loads products for a shared wishlist code and can merge selected ones into the user's list.
 */
export function useSharedWishlist(shareCode: string | null, enabled = true) {
  const queryClient = useQueryClient();
  const [isImporting, setIsImporting] = useState(false);
  const [exclusion, setExclusion] = useState<{ code: string | null; ids: number[] }>({
    code: shareCode,
    ids: []
  });
  const decodedIds = shareCode ? decodeWishlistShare(shareCode) : null;
  const hasValidShare = decodedIds != null && decodedIds.length > 0;
  const excludedIds = exclusion.code === shareCode ? exclusion.ids : [];

  const productsQuery = useGetProducts(
    {
      ids: decodedIds ?? undefined,
      limit: WISHLIST_SHARE_MAX_IDS,
      offset: 0
    },
    {
      query: {
        enabled: enabled && hasValidShare,
        staleTime: 60_000
      }
    }
  );

  const { mutateAsync: toggleLike } = usePostProductsIdLike();

  const excludedSet = new Set(excludedIds);
  const selectedProductIds = (decodedIds ?? []).filter((id) => !excludedSet.has(id));
  const products = (productsQuery.data?.data?.products ?? []).filter(
    (product) => product.id != null && !excludedSet.has(product.id)
  );

  const removeItem = (productId: number) => {
    setExclusion((prev) => {
      const current = prev.code === shareCode ? prev.ids : [];
      return {
        code: shareCode,
        ids: current.includes(productId) ? current : [...current, productId]
      };
    });
  };

  const saveSelectedToWishlist = async (): Promise<boolean> => {
    if (selectedProductIds.length === 0) return false;

    setIsImporting(true);
    try {
      await Promise.all(selectedProductIds.map((id) => toggleLike({ id, data: { like: true } })));
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: getGetAccountWishlistQueryKey() }),
        queryClient.invalidateQueries({ queryKey: getGetAccountSummaryQueryKey() })
      ]);
      toast.success('Saved selected items to your wishlist');
      return true;
    } catch {
      toast.error('Could not save shared items');
      return false;
    } finally {
      setIsImporting(false);
    }
  };

  return {
    productIds: selectedProductIds,
    sourceCount: decodedIds?.length ?? 0,
    hasValidShare,
    products,
    isLoading: hasValidShare && productsQuery.isLoading,
    isError: hasValidShare && productsQuery.isError,
    refetch: productsQuery.refetch,
    isImporting,
    removeItem,
    saveSelectedToWishlist
  };
}
