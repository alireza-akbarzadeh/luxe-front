'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { toast } from 'sonner';

import { getGetWorkflowsKeyEntityIdAvailableTransitionsQueryKey } from '@/services/-workflows-{key}-{entityId}-available-transitions-get';
import { useGetWorkflowsKeyEntityIdAvailableTransitions } from '@/services/-workflows-{key}-{entityId}-available-transitions-get';
import { getGetWorkflowsKeyEntityIdHistoryQueryKey } from '@/services/-workflows-{key}-{entityId}-history-get';
import { useGetWorkflowsKeyEntityIdHistory } from '@/services/-workflows-{key}-{entityId}-history-get';
import { usePostWorkflowsKeyEntityIdTransition } from '@/services/-workflows-{key}-{entityId}-transition-post';

import { parseWorkflowHistoryResponse } from '../lib/workflow-runtime';
import type { WorkflowEntityKey } from '../types/workflow-runtime.types';

interface UseEntityWorkflowOptions {
  workflowKey: WorkflowEntityKey;
  entityId: number;
  enabled?: boolean;
  historyLimit?: number;
  onTransitionSuccess?: () => void;
}

/**
 * Loads available transitions + history and performs workflow events for any entity type.
 */
export function useEntityWorkflow({
  workflowKey,
  entityId,
  enabled = true,
  historyLimit = 20,
  onTransitionSuccess
}: UseEntityWorkflowOptions) {
  const queryClient = useQueryClient();
  const isActive = enabled && entityId > 0;

  const transitionsQuery = useGetWorkflowsKeyEntityIdAvailableTransitions(workflowKey, entityId, {
    query: { enabled: isActive }
  });

  const historyQuery = useGetWorkflowsKeyEntityIdHistory(
    workflowKey,
    entityId,
    { limit: historyLimit, offset: 0 },
    { query: { enabled: isActive } }
  );

  const transitionMutation = usePostWorkflowsKeyEntityIdTransition({
    mutation: {
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: getGetWorkflowsKeyEntityIdAvailableTransitionsQueryKey(workflowKey, entityId)
        });
        void queryClient.invalidateQueries({
          queryKey: getGetWorkflowsKeyEntityIdHistoryQueryKey(workflowKey, entityId)
        });
        onTransitionSuccess?.();
      }
    }
  });

  const view = transitionsQuery.data?.data;
  const historyPage = parseWorkflowHistoryResponse(historyQuery.data);

  const performTransition = useCallback(
    async (event: string, note?: string) => {
      try {
        const result = await transitionMutation.mutateAsync({
          key: workflowKey,
          entityId,
          data: { event, note: note?.trim() || undefined }
        });

        const toState = result.data?.to_state?.name ?? event;
        toast.success('State updated', { description: `Moved to ${toState}` });
      } catch (error) {
        toast.error('Transition failed', {
          description: error instanceof Error ? error.message : 'Could not update workflow state'
        });
        throw error;
      }
    },
    [entityId, transitionMutation, workflowKey]
  );

  const refetch = useCallback(() => {
    void transitionsQuery.refetch();
    void historyQuery.refetch();
  }, [historyQuery, transitionsQuery]);

  return {
    currentState: view?.current_state,
    transitions: view?.transitions ?? [],
    history: historyPage.history,
    historyTotal: historyPage.total,
    isLoading: transitionsQuery.isLoading || historyQuery.isLoading,
    isFetching: transitionsQuery.isFetching || historyQuery.isFetching,
    isTransitioning: transitionMutation.isPending,
    performTransition,
    refetch
  };
}
