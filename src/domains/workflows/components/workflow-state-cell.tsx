'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useGetWorkflowsKeyEntityIdAvailableTransitions } from '@/services/-workflows-{key}-{entityId}-available-transitions-get';
import type { DtoStateView } from '@/services/-workflows-{key}-{entityId}-available-transitions-get.schemas';

import type { WorkflowEntityKey } from '../types/workflow-runtime.types';
import { WorkflowStateBadge } from './workflow-state-badge';

interface WorkflowStateCellProps {
  workflowKey?: WorkflowEntityKey;
  entityId?: number;
  /** When provided (e.g. from list API), skips a per-row workflow fetch. */
  state?: DtoStateView;
  fallbackLabel?: string;
  className?: string;
}

/**
 * Table cell that shows the current workflow state for an entity.
 * Prefer passing `state` from list/detail APIs; falls back to fetching transitions when omitted.
 */
export function WorkflowStateCell({
  workflowKey,
  entityId,
  state,
  fallbackLabel = '—',
  className
}: WorkflowStateCellProps) {
  const shouldFetch = !state && workflowKey != null && entityId != null && entityId > 0;

  const transitionsQuery = useGetWorkflowsKeyEntityIdAvailableTransitions(
    workflowKey ?? 'product',
    entityId ?? 0,
    {
      query: {
        enabled: shouldFetch,
        staleTime: 60_000
      }
    }
  );

  if (state) {
    return <WorkflowStateBadge state={state} className={className} fallbackLabel={fallbackLabel} />;
  }

  if (!entityId) {
    return <span className='text-muted-foreground text-xs'>{fallbackLabel}</span>;
  }

  if (shouldFetch && transitionsQuery.isLoading) {
    return <Skeleton className='h-5 w-20 rounded-full' />;
  }

  const resolvedState = transitionsQuery.data?.data?.current_state;

  if (!resolvedState) {
    return <span className='text-muted-foreground text-xs'>{fallbackLabel}</span>;
  }

  return (
    <WorkflowStateBadge state={resolvedState} className={className} fallbackLabel={fallbackLabel} />
  );
}
