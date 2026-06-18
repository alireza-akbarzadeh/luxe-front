import type { CSSProperties } from 'react';

import type { DtoStateView } from '@/services/-workflows-{key}-{entityId}-available-transitions-get.schemas';

import type { WorkflowHistoryPage } from '../types/workflow-runtime.types';

/** Parses workflow history API payload (nested under `data`). */
export function parseWorkflowHistoryResponse(data: unknown): WorkflowHistoryPage {
  const payload = (data as { data?: WorkflowHistoryPage } | WorkflowHistoryPage | undefined)?.data ?? data;

  if (!payload || typeof payload !== 'object') {
    return { history: [], total: 0, limit: 20, offset: 0 };
  }

  const page = payload as WorkflowHistoryPage;
  return {
    history: Array.isArray(page.history) ? page.history : [],
    total: page.total ?? 0,
    limit: page.limit ?? 20,
    offset: page.offset ?? 0
  };
}

/** Inline styles for workflow state badges using API colors. */
export function getWorkflowStateStyle(state?: DtoStateView): CSSProperties | undefined {
  if (!state?.color) return undefined;
  return {
    backgroundColor: state.color,
    color: state.text_color ?? '#ffffff'
  };
}
