'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { toast } from 'sonner';

import { getGetAdminShipmentsQueryKey } from '@/services/-admin-shipments-get';
import { usePostOrdersIdTransition } from '@/services/-orders-{id}-transition-post';
import { getGetOrdersQueryKey } from '@/services/-orders-get';

interface ApplyFulfillmentTransitionInput {
  orderId: number;
  event: string;
  note?: string;
  trackingNumber?: string;
}

/**
 * Runs admin order workflow transitions from the fulfillment center and refreshes queues.
 */
export function useFulfillmentTransition(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const mutation = usePostOrdersIdTransition({
    mutation: {
      onSuccess: (_data, variables) => {
        void queryClient.invalidateQueries({ queryKey: getGetOrdersQueryKey() });
        void queryClient.invalidateQueries({ queryKey: getGetAdminShipmentsQueryKey() });
        onSuccess?.();
        toast.success('Fulfillment updated', {
          description: variables.data.event.replaceAll('_', ' ')
        });
      },
      onError: (error) => {
        toast.error('Action failed', {
          description: error instanceof Error ? error.message : 'Could not update order'
        });
      }
    }
  });

  const applyTransition = useCallback(
    async ({ orderId, event, note, trackingNumber }: ApplyFulfillmentTransitionInput) => {
      await mutation.mutateAsync({
        id: orderId,
        data: {
          event,
          note: note?.trim() || undefined,
          tracking_number: trackingNumber?.trim() || undefined
        }
      });
    },
    [mutation]
  );

  return {
    applyTransition,
    isPending: mutation.isPending
  };
}
