import type { Edge, Node } from '@xyflow/react';

import type {
  WorkflowStateNodeData,
  WorkflowTransitionEdgeData
} from '@/domains/workflows/types';
import type { DtoWorkflowDefinitionView } from '@/services/-workflows-{key}-get.schemas';

export const ANY_STATE_NODE_ID = '__any__';
const NODE_WIDTH = 220;
const NODE_GAP_X = 80;
const ROW_Y = 160;

export type SavedLayout = Record<string, { x: number; y: number }>;

export function layoutStorageKey(workflowKey: string) {
  return `luxe:workflow-layout:${workflowKey}`;
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
): { nodes: Node<WorkflowStateNodeData>[]; edges: Edge<WorkflowTransitionEdgeData>[] } {
  const states = [...(definition.states ?? [])].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
  );

  const nodes: Node<WorkflowStateNodeData>[] = states.map((state, index) => {
    const id = String(state.id ?? state.code ?? index);
    const fallbackX = 40 + index * (NODE_WIDTH + NODE_GAP_X);
    const fallbackY = ROW_Y;
    const saved = savedLayout?.[id];

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
        sortOrder: state.sort_order ?? index
      }
    };
  });

  const hasWildcard = (definition.transitions ?? []).some((t) => !t.from_state?.id);
  if (hasWildcard) {
    const saved = savedLayout?.[ANY_STATE_NODE_ID];
    nodes.unshift({
      id: ANY_STATE_NODE_ID,
      type: 'workflowAny',
      position: saved ?? { x: 40, y: 24 },
      data: {
        stateId: 0,
        code: '*',
        name: 'Any state',
        color: '#1e293b',
        textColor: '#f8fafc',
        isInitial: false,
        isFinal: false,
        sortOrder: -1
      },
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
      source: sourceId,
      target: String(transition.to_state.id),
      label: transition.event,
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
