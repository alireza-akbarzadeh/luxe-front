import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useGetCompare, getGetCompareQueryKey } from '~/src/services/-compare-get';
import { postCompare } from '~/src/services/-compare-post';
import { usePutCompare } from '~/src/services/-compare-put';
import { useState } from 'react';

export default function useCompareController() {
  const queryClient = useQueryClient();
  const [highlightDiffs, setHighlightDiffs] = useState(true);

  // 1. Get compare list (IDs)
  const { data: compareData, isLoading: isLoadingIds, refetch } = useGetCompare();
  const productIds = compareData?.data?.product_ids || [];

  // 2. Fetch product details (POST as query)
  const { data: productsData, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['compare-products', productIds],
    queryFn: () => postCompare({ product_ids: productIds }),
    enabled: productIds.length >= 2
  });
  const compareProducts = productsData?.data || [];

  // 3. Update mutation (PUT)
  const putCompare = usePutCompare();
  const updateList = async (newIds: number[]) => {
    try {
      await putCompare.mutateAsync({ data: { product_ids: newIds } });
      await queryClient.invalidateQueries({ queryKey: getGetCompareQueryKey() });
      toast.success('Compare list updated');
    } catch {
      toast.error('Failed to update compare list');
    }
  };

  const addItem = async (productId: number) => {
    if (productIds.length >= 4) {
      toast.warning('You can only compare up to 4 products');
      return;
    }
    if (productIds.includes(productId)) {
      toast.info('Product already in compare list');
      return;
    }
    await updateList([...productIds, productId]);
  };

  const removeItem = async (productId: number) => {
    await updateList(productIds.filter((id) => id !== productId));
  };

  const clearAll = async () => {
    await updateList([]);
  };

  const isInCompare = (id: number) => productIds.includes(id);
  const canAddMore = productIds.length < 4;

  return {
    canAddMore,
    isInCompare,
    items: productIds,
    clearAll,
    addItem,
    removeItem,
    compareProducts,
    highlightDiffs,
    setHighlightDiffs,
    isLoading: isLoadingIds || isLoadingProducts,
    refetch
  };
}
