'use client';

import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { useRequireAuth } from '@/hooks/use-require-auth';
import { isUnauthorizedError } from '@/lib/api/api-utils';
import { useDeleteStoresSlugFollow } from '@/services/-stores-{slug}-follow-delete';
import { usePostStoresSlugFollow } from '@/services/-stores-{slug}-follow-post';
import { getGetStoresSlugQueryKey } from '@/services/-stores-{slug}-get';
import { getGetStoresQueryKey } from '@/services/-stores-get';

interface UseStoreFollowProps {
  slug: string;
  storeName?: string;
  onFollowChange?: (isFollowed: boolean) => void;
}

export function useStoreFollow({ slug, storeName, onFollowChange }: UseStoreFollowProps) {
  const queryClient = useQueryClient();
  const { openAuthDialog } = useRequireAuth();
  const label = storeName ?? slug;

  const invalidateStoreQueries = () => {
    queryClient.invalidateQueries({ queryKey: getGetStoresSlugQueryKey(slug) });
    queryClient.invalidateQueries({ queryKey: getGetStoresQueryKey() });
  };

  const handleAuthError = () => {
    toast.error('Sign in to follow stores');
    openAuthDialog({ reason: 'follow-store' });
  };

  const { mutate: followMutate, isPending: isFollowingPending } = usePostStoresSlugFollow();
  const { mutate: unfollowMutate, isPending: isUnFollowingPending } = useDeleteStoresSlugFollow();

  const follow = () => {
    onFollowChange?.(true);
    followMutate(
      { slug },
      {
        onSuccess: () => {
          invalidateStoreQueries();
          toast.success(`You're now following ${label}`);
        },
        onError: (error) => {
          onFollowChange?.(false);
          if (isUnauthorizedError(error)) {
            handleAuthError();
            return;
          }
          toast.error('Failed to follow store');
        }
      }
    );
  };

  const unfollow = () => {
    onFollowChange?.(false);
    unfollowMutate(
      { slug },
      {
        onSuccess: () => {
          invalidateStoreQueries();
          toast.success(`You unfollowed ${label}`);
        },
        onError: (error) => {
          onFollowChange?.(true);
          if (isUnauthorizedError(error)) {
            handleAuthError();
            return;
          }
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
