'use client';
import { IconHeart } from '@tabler/icons-react';
import { useQueryClient, type QueryKey } from '@tanstack/react-query';
import { useOptimistic, useTransition } from 'react';
import { toast } from 'sonner';
import { getGetProductsIdQueryKey } from '~/src/services/-products-{id}-get';
import type { GetProductsId200 } from '~/src/services/-products-{id}-get.schemas';
import type { GetProducts200 } from '~/src/services/-products-get.schemas';
import { usePostProductsIdLike } from '~/src/services/-products-{id}-like-post';
import { Button } from '../ui/button';
import { cn } from '~/src/hooks/useContextFactory';

interface LikeButtonProps {
  isLiked: boolean;
  productId: number;
  productName: string;
  className?: string;
  revalidate?: 'Product' | 'ProductList';
}

// Helper to update a product in a paginated list response
function updateProductInList(
  data: GetProducts200 | undefined,
  productId: number,
  isLiked: boolean
): GetProducts200 | undefined {
  if (!data?.data?.products) return data;
  return {
    ...data,
    data: {
      ...data.data,
      products: data.data.products.map((p) =>
        p.items?.id === productId ? { ...p, is_liked: isLiked } : p
      )
    }
  };
}

export function LikeButton(props: LikeButtonProps) {
  const { isLiked, productId, productName, className, revalidate = 'Product' } = props;
  const queryClient = useQueryClient();
  const [optimisticLiked, setOptimisticLiked] = useOptimistic(isLiked);
  const [isPending, startTransition] = useTransition();
  const { mutateAsync } = usePostProductsIdLike();

  const handleLikeAction = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault(); // prevent any parent link navigation

    const newLikeState = !optimisticLiked;
    startTransition(() => setOptimisticLiked(newLikeState));

    // 1. Optimistic update for product detail query
    const productQueryKey = getGetProductsIdQueryKey(String(productId));
    const previousProductData = queryClient.getQueryData(productQueryKey) as
      | GetProductsId200
      | undefined;
    if (previousProductData?.data) {
      queryClient.setQueryData(productQueryKey, {
        ...previousProductData,
        data: { ...previousProductData.data, is_liked: newLikeState }
      });
    }

    // 2. Optimistic update for all product list queries (if revalidate === 'ProductList')
    const previousListDataMap = new Map<QueryKey, unknown>();
    if (revalidate === 'ProductList') {
      // Find all queries whose key starts with the base product list key
      const allQueries = queryClient.getQueryCache().getAll();
      const listQueryKeys = allQueries
        .map((q) => q.queryKey)
        .filter((key) => Array.isArray(key) && key[0] === '/products' && key.length >= 1);

      for (const key of listQueryKeys) {
        const oldData = queryClient.getQueryData(key) as GetProducts200 | undefined;
        if (oldData?.data?.products) {
          previousListDataMap.set(key, oldData);
          const newData = updateProductInList(oldData, productId, newLikeState);
          queryClient.setQueryData(key, newData);
        }
      }
    }

    try {
      const response = await mutateAsync({
        id: productId,
        data: { like: newLikeState }
      });

      if (!response.success) {
        // Revert all optimistic updates on failure
        if (previousProductData) queryClient.setQueryData(productQueryKey, previousProductData);
        for (const [key, oldData] of previousListDataMap.entries()) {
          queryClient.setQueryData(key, oldData);
        }
        startTransition(() => setOptimisticLiked(isLiked));
        return;
      }

      // Success messages
      if (newLikeState) {
        toast.success(`${productName} added to your likes ✨`);
      } else {
        toast.success(`${productName} removed from your likes`);
      }

      // Invalidate detail query
      await queryClient.invalidateQueries({ queryKey: productQueryKey });

      // Invalidate all product list queries to sync with server (background refetch)
      if (revalidate === 'ProductList') {
        await queryClient.invalidateQueries({ queryKey: ['/products'], exact: false });
      }
    } catch (error) {
      // Revert on network errors
      if (previousProductData) queryClient.setQueryData(productQueryKey, previousProductData);
      for (const [key, oldData] of previousListDataMap.entries()) {
        queryClient.setQueryData(key, oldData);
      }
      startTransition(() => setOptimisticLiked(isLiked));
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <Button
      type='button'
      size='lg'
      variant='outline'
      onClick={handleLikeAction}
      disabled={isPending}
      aria-label='Wishlist'
      className={cn('transition-all duration-200 hover:scale-105 active:scale-95', className)}
    >
      <IconHeart
        className={`h-4 w-4 transition-all duration-200 ${
          optimisticLiked ? 'fill-accent text-accent' : ''
        } ${isPending ? 'animate-pulse' : ''}`}
      />
    </Button>
  );
}
