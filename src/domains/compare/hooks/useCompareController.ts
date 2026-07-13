import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

import { useAuth } from '@/components/providers/auth-provider';
import { MAX_COMPARE } from '@/domains/compare/lib/compare-constants';
import { getGetCompareQueryKey, useGetCompare } from '@/services/-compare-get';
import { postCompare } from '@/services/-compare-post';
import type { DtoCompareProductResponse } from '@/services/-compare-post.schemas';
import { usePutCompare } from '@/services/-compare-put';
import { getProductsId } from '@/services/-products-{id}-get';

function toCompareProduct(
  product: NonNullable<Awaited<ReturnType<typeof getProductsId>>['data']>['product']
): DtoCompareProductResponse | null {
  if (!product) return null;

  const compareAt = product.compare_at_price;
  const price = product.price ?? 0;
  const discount = compareAt && compareAt > price ? ((compareAt - price) / compareAt) * 100 : 0;

  return {
    ...product,
    store_name: product.store?.name,
    store_slug: product.store?.slug,
    store_logo: product.store?.logo_url,
    shipping_info: product.store?.shipping_info,
    return_policy: product.store?.return_policy,
    discount_percent: discount
  };
}

async function fetchCompareProducts(productIds: number[]) {
  if (productIds.length >= 2) {
    return postCompare({ product_ids: productIds });
  }

  const responses = await Promise.all(productIds.map((id) => getProductsId(String(id))));
  const products = responses
    .map((response) => toCompareProduct(response.data?.product))
    .filter((product): product is DtoCompareProductResponse => product != null);

  return { data: products };
}

/** Client-side compare list backed by Orval compare APIs. */
export default function useCompareController() {
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [highlightDiffs, setHighlightDiffs] = useState(true);

  const { data: compareData, isLoading: isLoadingIds } = useGetCompare(undefined, {
    query: { enabled: isAuthenticated && !isAuthLoading }
  });
  const productIds = compareData?.data?.product_ids ?? [];

  const { data: productsData, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['compare-products', productIds],
    queryFn: () => fetchCompareProducts(productIds),
    enabled: isAuthenticated && !isAuthLoading && productIds.length > 0
  });
  const compareProducts = productsData?.data ?? [];

  const putCompare = usePutCompare();
  const updateList = async (newIds: number[]) => {
    try {
      await putCompare.mutateAsync({ data: { product_ids: newIds } });
      await queryClient.invalidateQueries({ queryKey: getGetCompareQueryKey() });
      await queryClient.invalidateQueries({ queryKey: ['compare-products'] });
    } catch {
      toast.error('Failed to update compare list');
      throw new Error('compare sync failed');
    }
  };

  const addItem = async (productId: number) => {
    if (!isAuthenticated) {
      toast.message('Sign in to compare products');
      return;
    }
    if (productIds.length >= MAX_COMPARE) {
      toast.warning(`You can only compare up to ${MAX_COMPARE} products`);
      return;
    }
    if (productIds.includes(productId)) {
      toast.info('Product already in compare list');
      return;
    }
    try {
      await updateList([...productIds, productId]);
      toast.success('Added to compare');
    } catch {
      /* toast handled in updateList */
    }
  };

  const removeItem = async (productId: number) => {
    try {
      await updateList(productIds.filter((id) => id !== productId));
      toast.success('Removed from compare');
    } catch {
      /* toast handled in updateList */
    }
  };

  const clearAll = async () => {
    try {
      await updateList([]);
      toast.success('Compare list cleared');
    } catch {
      /* toast handled in updateList */
    }
  };

  const isInCompare = (id: number) => productIds.includes(id);
  const canAddMore = productIds.length < MAX_COMPARE;

  return {
    canAddMore,
    maxCompare: MAX_COMPARE,
    isInCompare,
    items: productIds,
    clearAll,
    addItem,
    removeItem,
    compareProducts,
    highlightDiffs,
    setHighlightDiffs,
    isLoading: isAuthLoading || (isAuthenticated && (isLoadingIds || isLoadingProducts)),
    isAuthenticated
  };
}
