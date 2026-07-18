import type { CSSProperties } from 'react';

import type { DtoStateView } from '@/services/-workflows-{key}-{entityId}-available-transitions-get.schemas';

import type { WorkflowHistoryPage } from '../types/workflow-runtime.types';

/** Parses workflow history API payload (nested under `data`). */
export function parseWorkflowHistoryResponse(data: unknown): WorkflowHistoryPage {
  const empty: WorkflowHistoryPage = { history: [], total: 0, limit: 20, offset: 0 };

  if (!data || typeof data !== 'object') return empty;

  const root = data as Record<string, unknown>;
  const nested = root['data'];
  const payload =
    nested && typeof nested === 'object'
      ? (nested as WorkflowHistoryPage)
      : (data as WorkflowHistoryPage);

  return {
    history: Array.isArray(payload.history) ? payload.history : [],
    total: payload.total ?? 0,
    limit: payload.limit ?? 20,
    offset: payload.offset ?? 0
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

const BRAND_STATUS_STATES: Record<string, DtoStateView> = {
  draft: { code: 'draft', name: 'Draft', color: '#F59E0B', text_color: '#FFFFFF' },
  active: { code: 'active', name: 'Active', color: '#10B981', text_color: '#FFFFFF' },
  inactive: { code: 'inactive', name: 'Inactive', color: '#9CA3AF', text_color: '#FFFFFF' },
  archived: { code: 'archived', name: 'Archived', color: '#EF4444', text_color: '#FFFFFF' },
  completed: { code: 'completed', name: 'Completed', color: '#10B981', text_color: '#FFFFFF' },
  paid: { code: 'paid', name: 'Paid', color: '#10B981', text_color: '#FFFFFF' }
};

const BLOG_POST_STATUS_STATES: Record<string, DtoStateView> = {
  draft: { code: 'draft', name: 'Draft', color: '#9CA3AF', text_color: '#FFFFFF' },
  in_review: { code: 'in_review', name: 'In Review', color: '#F59E0B', text_color: '#FFFFFF' },
  scheduled: { code: 'scheduled', name: 'Scheduled', color: '#3B82F6', text_color: '#FFFFFF' },
  published: { code: 'published', name: 'Published', color: '#10B981', text_color: '#FFFFFF' },
  archived: { code: 'archived', name: 'Archived', color: '#374151', text_color: '#FFFFFF' }
};

/** Maps legacy brand status strings to workflow-style badge views for grid display. */
export function mapBrandStatusToStateView(status?: string): DtoStateView {
  const key = (status ?? 'inactive').toLowerCase();
  return (
    BRAND_STATUS_STATES[key] ?? {
      code: key,
      name: key.charAt(0).toUpperCase() + key.slice(1),
      color: '#6B7280',
      text_color: '#FFFFFF'
    }
  );
}

/** Maps blog post status strings to workflow-style badge views for grid display. */
export function mapBlogPostStatusToStateView(status?: string): DtoStateView {
  const key = (status ?? 'draft').toLowerCase();
  return (
    BLOG_POST_STATUS_STATES[key] ?? {
      code: key,
      name: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
      color: '#6B7280',
      text_color: '#FFFFFF'
    }
  );
}

/** Maps privacy rule status strings to workflow-style badge views for grid display. */
export function mapPrivacyRuleStatusToStateView(status?: string): DtoStateView {
  return mapBrandStatusToStateView(status);
}

/** Maps category active flag to workflow-style badge views for grid display. */
export function mapCategoryActiveToStateView(isActive?: boolean): DtoStateView {
  return isActive
    ? { code: 'active', name: 'Active', color: '#10B981', text_color: '#FFFFFF' }
    : { code: 'inactive', name: 'Inactive', color: '#9CA3AF', text_color: '#FFFFFF' };
}
