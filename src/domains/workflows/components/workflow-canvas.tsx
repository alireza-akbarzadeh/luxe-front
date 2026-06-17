'use client';

import '@xyflow/react/dist/style.css';

import {
  IconLayoutGrid,
  IconPlus,
  IconRefresh,
  IconRoute,
  IconTopologyStar3
} from '@tabler/icons-react';
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
  ReactFlowProvider
} from '@xyflow/react';
import { useCallback, useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  WorkflowAnyNode,
  WorkflowStateNode
} from '@/domains/workflows/components/workflow-state-node';
import { WorkflowTransitionEdge } from '@/domains/workflows/components/workflow-transition-edge';
import { definitionToGraph, writeSavedLayout } from '@/domains/workflows/lib/workflow-graph';
import { useWorkflowEditorStore } from '@/domains/workflows/stores/workflow-editor-store';
import type { WorkflowNodeData, WorkflowTransitionEdgeData } from '@/domains/workflows/types';
import type { DtoWorkflowDefinitionView } from '@/services/-workflows-{key}-get.schemas';

const nodeTypes = {
  workflowState: WorkflowStateNode,
  workflowAny: WorkflowAnyNode
};

const edgeTypes = {
  workflowTransition: WorkflowTransitionEdge
};

interface WorkflowCanvasProps {
  workflowKey: string;
  definition: DtoWorkflowDefinitionView;
  nodes: Node<WorkflowNodeData>[];
  edges: Edge<WorkflowTransitionEdgeData>[];
  onNodesChange: OnNodesChange<Node<WorkflowNodeData>>;
  onEdgesChange: OnEdgesChange<Edge<WorkflowTransitionEdgeData>>;
  setNodes: React.Dispatch<React.SetStateAction<Node<WorkflowNodeData>[]>>;
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

  const stateCount = definition.states?.length ?? 0;
  const transitionCount = definition.transitions?.length ?? 0;

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
    <div className='relative h-[calc(100vh-9rem)] min-h-[420px] w-full overflow-hidden rounded-lg border p-4 [&_.react-flow__edge-labels]:z-[1000] [&_.react-flow__nodes]:z-[1]'>
      <ReactFlow
        className='h-full w-full'
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDoubleClick={onNodeDoubleClick}
        onEdgeClick={onEdgeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.04, minZoom: 0.45, maxZoom: 1.15 }}
        defaultViewport={defaultViewport}
        elevateEdgesOnSelect
        proOptions={{ hideAttribution: true }}
        connectionLineStyle={{ stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '6 4' }}
        defaultEdgeOptions={{ type: 'workflowTransition' }}
        snapToGrid
        snapGrid={[16, 16]}
        minZoom={0.35}
        maxZoom={1.5}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color='#cbd5e1' />
        <Controls
          showInteractive={false}
          className='!bg-card/95 [&>button]:!border-border/50 !overflow-hidden !rounded-xl !border !shadow-lg backdrop-blur-sm'
        />
        <MiniMap
          nodeStrokeWidth={3}
          zoomable
          pannable
          className='!bg-card/90 !overflow-hidden !rounded-xl !border !shadow-lg'
          maskColor='rgb(15 23 42 / 0.08)'
        />

        <Panel position='top-left' className='!m-0'>
          <div className='bg-card/95 flex flex-wrap items-center gap-1 rounded-lg border p-1 shadow-md backdrop-blur-sm'>
            <Button size='sm' className='h-8 gap-1.5 rounded-lg' onClick={() => openCreateState()}>
              <IconPlus size={15} />
              Add state
            </Button>
            <Separator orientation='vertical' className='mx-0.5 h-6' />
            <Button
              size='sm'
              variant='ghost'
              className='h-8 gap-1.5 rounded-lg'
              onClick={autoLayout}
            >
              <IconLayoutGrid size={15} />
              Auto layout
            </Button>
            <Button
              size='sm'
              variant='ghost'
              className='h-8 gap-1.5 rounded-lg'
              onClick={saveLayout}
            >
              Save layout
            </Button>
            <Button
              size='sm'
              variant='ghost'
              className='h-8 gap-1.5 rounded-lg'
              onClick={onRefresh}
              disabled={isRefreshing}
            >
              <IconRefresh size={15} className={isRefreshing ? 'animate-spin' : ''} />
              Refresh
            </Button>
          </div>
        </Panel>

        <Panel position='top-right' className='!m-0'>
          <div className='bg-card/95 flex gap-2 rounded-lg border px-2.5 py-1.5 shadow-md backdrop-blur-sm'>
            <div className='flex items-center gap-2'>
              <IconTopologyStar3 size={14} className='text-muted-foreground' />
              <span className='text-muted-foreground text-xs'>States</span>
              <span className='text-sm font-semibold tabular-nums'>{stateCount}</span>
            </div>
            <Separator orientation='vertical' className='h-5' />
            <div className='flex items-center gap-2'>
              <IconRoute size={14} className='text-muted-foreground' />
              <span className='text-muted-foreground text-xs'>Transitions</span>
              <span className='text-sm font-semibold tabular-nums'>{transitionCount}</span>
            </div>
          </div>
        </Panel>

        <Panel position='bottom-center' className='!mb-0'>
          <div className='bg-card/90 text-muted-foreground flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full border px-3 py-1.5 text-[11px] shadow-sm backdrop-blur-sm'>
            <span>
              <strong className='text-foreground font-medium'>Connect</strong> drag from handle
            </span>
            <span className='hidden sm:inline'>·</span>
            <span>
              <strong className='text-foreground font-medium'>Edit state</strong> double-click node
            </span>
            <span className='hidden sm:inline'>·</span>
            <span>
              <strong className='text-foreground font-medium'>Edit transition</strong> click edge
            </span>
          </div>
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
