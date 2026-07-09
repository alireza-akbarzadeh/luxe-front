'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { toast } from 'sonner';

import { getGetAdminReturnsIdQueryKey } from '@/services/-admin-returns-{id}-get';
import { usePostAdminReturnsIdTransition } from '@/services/-admin-returns-{id}-transition-post';
import { getGetAdminReturnsQueryKey } from '@/services/-admin-returns-get';
import { getGetAdminReturnsStatsQueryKey } from '@/services/-admin-returns-stats-get';

/**
 * Runs admin return workflow transitions and refreshes list/detail caches.
 */
export function useReturnTransition(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const mutation = usePostAdminReturnsIdTransition({
    mutation: {
      onSuccess: (_data, variables) => {
        void queryClient.invalidateQueries({ queryKey: getGetAdminReturnsQueryKey() });
        void queryClient.invalidateQueries({
          queryKey: getGetAdminReturnsIdQueryKey(variables.id)
        });
        void queryClient.invalidateQueries({ queryKey: getGetAdminReturnsStatsQueryKey() });
        onSuccess?.();
        toast.success('Return updated');
      },
      onError: (error) => {
        toast.error('Action failed', {
          description: error instanceof Error ? error.message : 'Could not update return'
        });
      }
    }
  });

  const applyTransition = useCallback(
    async (returnId: number, event: string, note?: string) => {
      await mutation.mutateAsync({
        id: returnId,
        data: { event, note: note?.trim() || undefined }
      });
    },
    [mutation]
  );

  return { applyTransition, isPending: mutation.isPending };
}
