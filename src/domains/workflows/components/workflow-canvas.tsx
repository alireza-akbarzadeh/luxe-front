'use client';

import '@xyflow/react/dist/style.css';

import { IconLayoutGrid, IconPlus, IconRefresh } from '@tabler/icons-react';
import {
  Background,
  BackgroundVariant,
  type Connection,
  Controls,
  type Edge,
  MiniMap,
  type Node,
  type OnEdgesChange,
  type OnNodesChange,
  Panel,
  ReactFlow,
  ReactFlowProvider} from '@xyflow/react';
import { useCallback, useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { WorkflowAnyNode, WorkflowStateNode } from '@/domains/workflows/components/workflow-state-node';
import {
  definitionToGraph,
  writeSavedLayout
} from '@/domains/workflows/lib/workflow-graph';
import { useWorkflowEditorStore } from '@/domains/workflows/stores/workflow-editor-store';
import type {
  WorkflowStateNodeData,
  WorkflowTransitionEdgeData
} from '@/domains/workflows/types';
import type { DtoWorkflowDefinitionView } from '@/services/-workflows-{key}-get.schemas';

const nodeTypes = {
  workflowState: WorkflowStateNode,
  workflowAny: WorkflowAnyNode
};

interface WorkflowCanvasProps {
  workflowKey: string;
  definition: DtoWorkflowDefinitionView;
  nodes: Node<WorkflowStateNodeData>[];
  edges: Edge<WorkflowTransitionEdgeData>[];
  onNodesChange: OnNodesChange<Node<WorkflowStateNodeData>>;
  onEdgesChange: OnEdgesChange<Edge<WorkflowTransitionEdgeData>>;
  setNodes: React.Dispatch<React.SetStateAction<Node<WorkflowStateNodeData>[]>>;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

function WorkflowCanvasInner({
  workflowKey,
  definition,
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  setNodes,
  onRefresh,
  isRefreshing
}: WorkflowCanvasProps) {
  const { openCreateState, openEditState, openCreateTransition, openEditTransition } =
    useWorkflowEditorStore();

  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;
      openCreateTransition(connection.source, connection.target);
    },
    [openCreateTransition]
  );

  const onNodeDoubleClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (node.id === '__any__') return;
      const state = definition.states?.find((s) => String(s.id) === node.id);
      if (state) openEditState(state);
    },
    [definition.states, openEditState]
  );

  const onEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      const data = edge.data as WorkflowTransitionEdgeData | undefined;
      if (data?.transitionId) openEditTransition(data);
    },
    [openEditTransition]
  );

  const autoLayout = useCallback(() => {
    const fresh = definitionToGraph(definition);
    setNodes(fresh.nodes);
    writeSavedLayout(workflowKey, fresh.nodes);
  }, [definition, setNodes, workflowKey]);

  const saveLayout = useCallback(() => {
    writeSavedLayout(workflowKey, nodes);
  }, [nodes, workflowKey]);

  const defaultViewport = useMemo(() => ({ x: 0, y: 0, zoom: 0.85 }), []);

  return (
    <div className='h-[calc(100vh-12rem)] min-h-[520px] w-full overflow-hidden rounded-xl border bg-slate-950/5 dark:bg-slate-950/40'>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDoubleClick={onNodeDoubleClick}
        onEdgeClick={onEdgeClick}
        nodeTypes={nodeTypes}
        fitView
        defaultViewport={defaultViewport}
        proOptions={{ hideAttribution: true }}
        connectionLineStyle={{ stroke: '#6366f1', strokeWidth: 2 }}
        snapToGrid
        snapGrid={[16, 16]}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color='#94a3b8' />
        <Controls showInteractive={false} className='!bg-card !shadow-md' />
        <MiniMap
          nodeStrokeWidth={3}
          zoomable
          pannable
          className='!bg-card/90 !shadow-md'
        />
        <Panel position='top-left' className='flex flex-wrap gap-2'>
          <Button size='sm' onClick={() => openCreateState()}>
            <IconPlus size={16} />
            Add state
          </Button>
          <Button size='sm' variant='outline' onClick={autoLayout}>
            <IconLayoutGrid size={16} />
            Auto layout
          </Button>
          <Button size='sm' variant='outline' onClick={saveLayout}>
            Save layout
          </Button>
          <Button size='sm' variant='ghost' onClick={onRefresh} disabled={isRefreshing}>
            <IconRefresh size={16} className={isRefreshing ? 'animate-spin' : ''} />
            Refresh
          </Button>
        </Panel>
        <Panel position='bottom-center'>
          <p className='text-muted-foreground rounded-full bg-card/90 px-4 py-1.5 text-xs shadow-sm backdrop-blur'>
            Drag from a handle to connect states · Double-click a state to edit · Click an edge to
            edit transition
          </p>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export function WorkflowCanvas(props: WorkflowCanvasProps) {
  return (
    <ReactFlowProvider>
      <WorkflowCanvasInner {...props} />
    </ReactFlowProvider>
  );
}
