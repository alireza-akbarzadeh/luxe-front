export interface WorkflowStateNodeData {
  stateId: number;
  code: string;
  name: string;
  color: string;
  textColor: string;
  isInitial: boolean;
  isFinal: boolean;
  sortOrder: number;
  [key: string]: unknown;
}

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
