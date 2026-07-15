import type {
  DtoStateView,
  DtoTransitionView
} from '@/services/-workflows-{key}-{entityId}-available-transitions-get.schemas';

/** Supported workflow entity keys (matches backend workflow definitions). */
export type WorkflowEntityKey =
  | 'product'
  | 'order'
  | 'shipment'
  | 'return'
  | 'user'
  | 'category'
  | 'brand'
  | 'collection'
  | 'coupon'
  | 'review'
  | 'blog_post';

export interface WorkflowHistoryEntry {
  id?: number;
  event?: string;
  from_state?: DtoStateView;
  to_state?: DtoStateView;
  user_id?: number;
  user_name?: string;
  note?: string;
  success?: boolean;
  error_msg?: string;
  created_at?: string;
}

export interface WorkflowHistoryPage {
  history: WorkflowHistoryEntry[];
  total: number;
  limit: number;
  offset: number;
}

export interface EntityWorkflowView {
  currentState?: DtoStateView;
  transitions: DtoTransitionView[];
}
