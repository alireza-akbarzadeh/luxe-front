import type { Edge, Node } from '@xyflow/react';

import type {
  WorkflowAnyNodeData,
  WorkflowNodeData,
  WorkflowTransitionEdgeData
} from '@/domains/workflows/types';
import type { DtoWorkflowDefinitionView } from '@/services/-workflows-{key}-get.schemas';

export const ANY_STATE_NODE_ID = '__any__';
/** Approximate rendered node width used for auto-layout spacing. */
const NODE_WIDTH = 260;
/** Horizontal gap between nodes — keep wide enough for edge labels. */
const NODE_GAP_X = 240;
const ROW_Y = 100;
const LAYOUT_START_X = 24;
const LAYOUT_VERSION = 2;

export type SavedLayout = Record<string, { x: number; y: number }>;

interface StateMetrics {
  incomingCount: number;
  outgoingCount: number;
  incomingEvents: string[];
  outgoingEvents: string[];
  hasGuardedExit: boolean;
  hasHookExit: boolean;
  hasAdminExit: boolean;
}

function emptyMetrics(): StateMetrics {
  return {
    incomingCount: 0,
    outgoingCount: 0,
    incomingEvents: [],
    outgoingEvents: [],
    hasGuardedExit: false,
    hasHookExit: false,
    hasAdminExit: false
  };
}

function buildStateMetrics(definition: DtoWorkflowDefinitionView): Map<number, StateMetrics> {
  const metrics = new Map<number, StateMetrics>();

  for (const state of definition.states ?? []) {
    if (state.id) metrics.set(state.id, emptyMetrics());
  }

  for (const transition of definition.transitions ?? []) {
    const toId = transition.to_state?.id;
    const fromId = transition.from_state?.id;

    if (toId && metrics.has(toId)) {
      const entry = metrics.get(toId)!;
      entry.incomingCount += 1;
      if (transition.event) entry.incomingEvents.push(transition.event);
    }

    if (fromId && metrics.has(fromId)) {
      const entry = metrics.get(fromId)!;
      entry.outgoingCount += 1;
      if (transition.event) entry.outgoingEvents.push(transition.event);
      if (transition.guard_key) entry.hasGuardedExit = true;
      if (transition.hook_key) entry.hasHookExit = true;
      if (transition.required_role) entry.hasAdminExit = true;
    }
  }

  return metrics;
}

export function layoutStorageKey(workflowKey: string) {
  return `luxe:workflow-layout:v${LAYOUT_VERSION}:${workflowKey}`;
}

export function readSavedLayout(workflowKey: string): SavedLayout | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    const raw = localStorage.getItem(layoutStorageKey(workflowKey));
    return raw ? (JSON.parse(raw) as SavedLayout) : undefined;
  } catch {
    return undefined;
  }
}

export function writeSavedLayout(workflowKey: string, nodes: Node[]) {
  const layout: SavedLayout = {};
  for (const node of nodes) {
    layout[node.id] = { x: node.position.x, y: node.position.y };
  }
  localStorage.setItem(layoutStorageKey(workflowKey), JSON.stringify(layout));
}

/** Converts a workflow definition into React Flow nodes and edges. */
export function definitionToGraph(
  definition: DtoWorkflowDefinitionView,
  savedLayout?: SavedLayout
): {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge<WorkflowTransitionEdgeData>[];
} {
  const stateMetrics = buildStateMetrics(definition);
  const states = [...(definition.states ?? [])].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
  );

  const nodes: Node<WorkflowNodeData>[] = states.map((state, index) => {
    const id = String(state.id ?? state.code ?? index);
    const fallbackX = LAYOUT_START_X + index * (NODE_WIDTH + NODE_GAP_X);
    const fallbackY = ROW_Y;
    const saved = savedLayout?.[id];
    const metrics = state.id ? stateMetrics.get(state.id) : undefined;

    return {
      id,
      type: 'workflowState',
      position: saved ?? { x: fallbackX, y: fallbackY },
      data: {
        stateId: state.id ?? 0,
        code: state.code ?? '',
        name: state.name ?? state.code ?? 'State',
        color: state.color ?? '#6B7280',
        textColor: state.text_color ?? '#FFFFFF',
        isInitial: state.is_initial ?? false,
        isFinal: state.is_final ?? false,
        sortOrder: state.sort_order ?? index,
        incomingCount: metrics?.incomingCount ?? 0,
        outgoingCount: metrics?.outgoingCount ?? 0,
        incomingEvents: metrics?.incomingEvents ?? [],
        outgoingEvents: metrics?.outgoingEvents ?? [],
        hasGuardedExit: metrics?.hasGuardedExit ?? false,
        hasHookExit: metrics?.hasHookExit ?? false,
        hasAdminExit: metrics?.hasAdminExit ?? false,
        stateForEdit: {
          id: state.id,
          code: state.code,
          name: state.name,
          color: state.color,
          text_color: state.text_color,
          is_initial: state.is_initial,
          is_final: state.is_final,
          sort_order: state.sort_order
        }
      }
    };
  });

  const wildcardTransitions = (definition.transitions ?? []).filter((t) => !t.from_state?.id);
  const hasWildcard = wildcardTransitions.length > 0;

  if (hasWildcard) {
    const saved = savedLayout?.[ANY_STATE_NODE_ID];
    nodes.unshift({
      id: ANY_STATE_NODE_ID,
      type: 'workflowAny',
      position: saved ?? { x: 40, y: 24 },
      data: {
        wildcardOutgoingCount: wildcardTransitions.length,
        outgoingEvents: wildcardTransitions
          .map((t) => t.event)
          .filter((event): event is string => Boolean(event))
      } satisfies WorkflowAnyNodeData,
      draggable: true,
      selectable: true
    });
  }

  const edges: Edge<WorkflowTransitionEdgeData>[] = [];
  for (const transition of definition.transitions ?? []) {
    if (!transition.id || !transition.to_state?.id) continue;

    const sourceId = transition.from_state?.id
      ? String(transition.from_state.id)
      : ANY_STATE_NODE_ID;

    edges.push({
      id: `t-${transition.id}`,
      type: 'workflowTransition',
      source: sourceId,
      target: String(transition.to_state.id),
      animated: transition.is_active !== false,
      style: {
        stroke: transition.is_active === false ? '#94a3b8' : '#6366f1',
        strokeWidth: 2
      },
      data: {
        transitionId: transition.id,
        event: transition.event ?? '',
        name: transition.name ?? transition.event ?? '',
        requiredRole: transition.required_role,
        guardKey: transition.guard_key,
        hookKey: transition.hook_key,
        isActive: transition.is_active !== false,
        isWildcard: !transition.from_state?.id
      }
    });
  }

  return { nodes, edges };
}

export function stateCodeByNodeId(
  definition: DtoWorkflowDefinitionView,
  nodeId: string
): string | undefined {
  if (nodeId === ANY_STATE_NODE_ID) return undefined;
  const state = definition.states?.find((s) => String(s.id) === nodeId);
  return state?.code;
}
