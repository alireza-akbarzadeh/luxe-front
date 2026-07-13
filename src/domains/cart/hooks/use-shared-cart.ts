'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

import type { CartShareLine } from '@/domains/cart/lib/cart-share';
import { CART_SHARE_MAX_ITEMS, decodeCartShare } from '@/domains/cart/lib/cart-share';
import { getGetCartQueryKey } from '@/services/-cart-get';
import { usePostCartItems } from '@/services/-cart-items-post';
import { useGetProducts } from '@/services/-products-get';
import type { DtoProductWithLike } from '@/services/-products-get.schemas';

export type SharedCartPreviewItem = {
  key: string;
  line: CartShareLine;
  product: DtoProductWithLike | null;
};

function lineKey(line: CartShareLine, index: number): string {
  return `${line.id}:${line.c ?? ''}:${line.s ?? ''}:${index}`;
}

/**
 * Loads products for a shared cart code and can merge selected lines into the user's cart.
 */
export function useSharedCart(shareCode: string | null, enabled = true) {
  const queryClient = useQueryClient();
  const [isImporting, setIsImporting] = useState(false);
  const [exclusion, setExclusion] = useState<{ code: string | null; keys: string[] }>({
    code: shareCode,
    keys: []
  });
  const decodedLines = shareCode ? decodeCartShare(shareCode) : null;
  const hasValidShare = decodedLines != null && decodedLines.length > 0;
  const productIds = hasValidShare ? [...new Set(decodedLines.map((line) => line.id))] : [];
  const excludedKeys = exclusion.code === shareCode ? exclusion.keys : [];

  const productsQuery = useGetProducts(
    {
      ids: productIds,
      limit: CART_SHARE_MAX_ITEMS,
      offset: 0
    },
    {
      query: {
        enabled: enabled && hasValidShare,
        staleTime: 60_000
      }
    }
  );

  const { mutateAsync: addCartItem } = usePostCartItems();
  const products = productsQuery.data?.data?.products ?? [];
  const productById = new Map(
    products.flatMap((product) => (product.id ? [[product.id, product] as const] : []))
  );

  const excludedSet = new Set(excludedKeys);
  const allPreviewItems: SharedCartPreviewItem[] = (decodedLines ?? []).map((line, index) => ({
    key: lineKey(line, index),
    line,
    product: productById.get(line.id) ?? null
  }));
  const previewItems = allPreviewItems.filter((item) => !excludedSet.has(item.key));
  const selectedLines = previewItems.map((item) => item.line);

  const removeLine = (key: string) => {
    setExclusion((prev) => {
      const current = prev.code === shareCode ? prev.keys : [];
      return {
        code: shareCode,
        keys: current.includes(key) ? current : [...current, key]
      };
    });
  };

  const saveSelectedToCart = async (): Promise<boolean> => {
    if (selectedLines.length === 0) return false;

    setIsImporting(true);
    try {
      for (const line of selectedLines) {
        await addCartItem({
          data: {
            product_id: line.id,
            quantity: line.q,
            color: line.c ?? '',
            size: line.s ?? ''
          }
        });
      }
      await queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
      toast.success('Selected basket items added to your cart');
      return true;
    } catch {
      toast.error('Could not add shared basket items');
      return false;
    } finally {
      setIsImporting(false);
    }
  };

  return {
    lines: selectedLines,
    sourceCount: decodedLines?.length ?? 0,
    hasValidShare,
    previewItems,
    itemCount: selectedLines.reduce((sum, line) => sum + line.q, 0),
    isLoading: hasValidShare && productsQuery.isLoading,
    isError: hasValidShare && productsQuery.isError,
    refetch: productsQuery.refetch,
    isImporting,
    removeLine,
    saveSelectedToCart
  };
}
