export interface WorkflowStateNodeData {
  stateId: number;
  code: string;
  name: string;
  color: string;
  textColor: string;
  isInitial: boolean;
  isFinal: boolean;
  sortOrder: number;
  incomingCount: number;
  outgoingCount: number;
  incomingEvents: string[];
  outgoingEvents: string[];
  hasGuardedExit: boolean;
  hasHookExit: boolean;
  hasAdminExit: boolean;
  /** Snapshot for opening the edit panel from the node card. */
  stateForEdit: {
    id?: number;
    code?: string;
    name?: string;
    color?: string;
    text_color?: string;
    is_initial?: boolean;
    is_final?: boolean;
    sort_order?: number;
  };
  [key: string]: unknown;
}

export interface WorkflowAnyNodeData {
  wildcardOutgoingCount: number;
  outgoingEvents: string[];
  [key: string]: unknown;
}

export type WorkflowNodeData = WorkflowStateNodeData | WorkflowAnyNodeData;

export interface WorkflowTransitionEdgeData {
  transitionId: number;
  event: string;
  name: string;
  requiredRole?: string;
  guardKey?: string;
  hookKey?: string;
  isActive: boolean;
  isWildcard: boolean;
  [key: string]: unknown;
}
