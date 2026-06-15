'use client';

import { useQueryClient } from '@tanstack/react-query';

import { getGetProductsIdQueryKey } from '@/services/-products-{id}-get';
import { useDeleteReviewsId } from '@/services/-reviews-{id}-delete';
import { usePutReviewsId } from '@/services/-reviews-{id}-put';
import { getGetReviewsQueryKey } from '@/services/-reviews-get';
import { getGetReviewsMeQueryKey } from '@/services/-reviews-me-get';
import { usePostReviews } from '@/services/-reviews-post';

/** Mutations for product reviews with query cache invalidation. */
export function useProductReviewMutations(productId: number) {
  const queryClient = useQueryClient();
  const productIdStr = String(productId);

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: getGetReviewsQueryKey({ product_id: productId })
    });
    queryClient.invalidateQueries({ queryKey: getGetReviewsMeQueryKey({ product_id: productId }) });
    queryClient.invalidateQueries({ queryKey: getGetProductsIdQueryKey(productIdStr) });
  };

  const createReview = usePostReviews({ mutation: { onSuccess: invalidate } });
  const updateReview = usePutReviewsId({ mutation: { onSuccess: invalidate } });
  const deleteReview = useDeleteReviewsId({ mutation: { onSuccess: invalidate } });

  return { createReview, updateReview, deleteReview };
}
