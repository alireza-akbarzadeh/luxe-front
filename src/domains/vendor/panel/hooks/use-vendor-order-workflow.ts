'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { toast } from 'sonner';

import {
  getVendorStoreOrderTransitions,
  performVendorStoreOrderTransition,
  type VendorWorkflowTransitionView
} from '@/lib/api/vendor-orders';

interface UseVendorOrderWorkflowOptions {
  storeId: number;
  orderId: number;
  enabled?: boolean;
  onTransitionSuccess?: () => void;
}

/**
 * Loads vendor-scoped order workflow transitions and applies fulfillment events.
 */
export function useVendorOrderWorkflow({
  storeId,
  orderId,
  enabled = true,
  onTransitionSuccess
}: UseVendorOrderWorkflowOptions) {
  const queryClient = useQueryClient();
  const isActive = enabled && storeId > 0 && orderId > 0;

  const transitionsQuery = useQuery({
    queryKey: ['vendor-order-transitions', storeId, orderId],
    queryFn: () => getVendorStoreOrderTransitions(storeId, orderId),
    enabled: isActive
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: { event: string; note?: string; tracking_number?: string }) =>
      performVendorStoreOrderTransition(storeId, orderId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['vendor-order-transitions', storeId, orderId]
      });
      void queryClient.invalidateQueries({ queryKey: ['vendor-store-order', storeId, orderId] });
      void queryClient.invalidateQueries({ queryKey: ['vendor-store-orders', storeId] });
      onTransitionSuccess?.();
    }
  });

  const view = transitionsQuery.data?.data;

  const performTransition = useCallback(
    async (event: string, note?: string, trackingNumber?: string) => {
      try {
        await mutateAsync({
          event,
          note: note?.trim() || undefined,
          tracking_number: trackingNumber?.trim() || undefined
        });
        toast.success('Order updated');
      } catch (error) {
        toast.error('Could not update order', {
          description: error instanceof Error ? error.message : undefined
        });
        throw error;
      }
    },
    [mutateAsync]
  );

  return {
    currentState: view?.current_state,
    transitions: (view?.transitions ?? []) as VendorWorkflowTransitionView[],
    isLoading: transitionsQuery.isLoading,
    isFetching: transitionsQuery.isFetching,
    isTransitioning: isPending,
    performTransition,
    refetch: transitionsQuery.refetch
  };
}
