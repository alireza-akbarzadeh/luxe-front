import type { ColumnDef } from '@tanstack/react-table';

import type { DtoStateView } from '@/services/-workflows-{key}-{entityId}-available-transitions-get.schemas';

import { WorkflowStateCell } from '../components/workflow-state-cell';
import type { WorkflowEntityKey } from '../types/workflow-runtime.types';

interface CreateWorkflowStateColumnOptions<TData> {
  /** Required when `getState` does not supply the current state (falls back to API fetch). */
  workflowKey?: WorkflowEntityKey;
  getEntityId?: (row: TData) => number | undefined;
  /** Read workflow state from row data when the list API includes it. */
  getState?: (row: TData) => DtoStateView | undefined;
  id?: string;
  header?: string;
  fallbackLabel?: string;
}

/**
 * Factory for a reusable DataTable column that displays workflow state per row.
 */
export function createWorkflowStateColumn<TData>({
  workflowKey,
  getEntityId,
  getState,
  id = 'workflow_state',
  header = 'Workflow',
  fallbackLabel
}: CreateWorkflowStateColumnOptions<TData>): ColumnDef<TData> {
  return {
    id,
    accessorKey: id,
    header,
    cell: ({ row }) => {
      const original = row.original;
      const entityId = getEntityId?.(original);
      const state = getState?.(original);

      return (
        <WorkflowStateCell
          workflowKey={workflowKey}
          entityId={entityId}
          state={state}
          fallbackLabel={fallbackLabel}
        />
      );
    }
  };
}
