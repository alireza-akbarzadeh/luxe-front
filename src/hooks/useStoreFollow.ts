'use client';

import { useQueryClient } from '@tanstack/react-query';
import { usePostStoresSlugFollow } from '@/services/-stores-{slug}-follow-post';
import { useDeleteStoresSlugFollow } from '@/services/-stores-{slug}-follow-delete';
import { getGetStoresSlugQueryKey } from '@/services/-stores-{slug}-get';
import { toast } from 'sonner';

interface UseStoreFollowProps {
  slug: string;
}

export function useStoreFollow({ slug }: UseStoreFollowProps) {
  const queryClient = useQueryClient();

  const invalidateStore = () => {
    queryClient.invalidateQueries({ queryKey: getGetStoresSlugQueryKey(slug) });
  };

  const { mutate: followMutate, isPending: isFollowingPending } = usePostStoresSlugFollow();
  const { mutate: unfollowMutate, isPending: isUnFollowingPending } = useDeleteStoresSlugFollow();

  const follow = () => {
    followMutate(
      { slug },
      {
        onSuccess: () => {
          invalidateStore();
          toast.success(`You are now following ${slug}`);
        },
        onError: () => {
          toast.error('Failed to follow store');
        }
      }
    );
  };

  const unfollow = () => {
    unfollowMutate(
      { slug },
      {
        onSuccess: () => {
          invalidateStore();
          toast.success(`You unfollowed ${slug}`);
        },
        onError: () => {
          toast.error('Failed to unfollow store');
        }
      }
    );
  };

  return {
    follow,
    unfollow,
    isLoading: isFollowingPending || isUnFollowingPending
  };
}
