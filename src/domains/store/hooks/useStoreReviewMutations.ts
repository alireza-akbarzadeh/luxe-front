'use client';

import { useQueryClient } from '@tanstack/react-query';

import { getGetStoresSlugQueryKey } from '@/services/-stores-{slug}-get';
import { useDeleteStoresSlugReviewsReviewId } from '@/services/-stores-{slug}-reviews-{reviewId}-delete';
import { usePutStoresSlugReviewsReviewId } from '@/services/-stores-{slug}-reviews-{reviewId}-put';
import { getGetStoresSlugReviewsQueryKey } from '@/services/-stores-{slug}-reviews-get';
import { getGetStoresSlugReviewsMeQueryKey } from '@/services/-stores-{slug}-reviews-me-get';
import { usePostStoresSlugReviews } from '@/services/-stores-{slug}-reviews-post';

/** Mutations for store reviews with query cache invalidation. */
export function useStoreReviewMutations(slug: string) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: getGetStoresSlugReviewsQueryKey(slug) });
    queryClient.invalidateQueries({ queryKey: getGetStoresSlugReviewsMeQueryKey(slug) });
    queryClient.invalidateQueries({ queryKey: getGetStoresSlugQueryKey(slug) });
  };

  const createReview = usePostStoresSlugReviews({ mutation: { onSuccess: invalidate } });
  const updateReview = usePutStoresSlugReviewsReviewId({ mutation: { onSuccess: invalidate } });
  const deleteReview = useDeleteStoresSlugReviewsReviewId({ mutation: { onSuccess: invalidate } });

  return { createReview, updateReview, deleteReview };
}
