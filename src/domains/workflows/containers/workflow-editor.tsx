'use client';

import { IconArrowLeft } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import {
  type Edge,
  type Node,
  useEdgesState,
  useNodesState} from '@xyflow/react';
import Link from 'next/link';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { WorkflowCanvas } from '@/domains/workflows/components/workflow-canvas';
import { WorkflowEditorPanels } from '@/domains/workflows/components/workflow-editor-panels';
import { definitionToGraph, readSavedLayout } from '@/domains/workflows/lib/workflow-graph';
import { useWorkflowEditorStore } from '@/domains/workflows/stores/workflow-editor-store';
import type {
  WorkflowStateNodeData,
  WorkflowTransitionEdgeData
} from '@/domains/workflows/types';
import { usePatchAdminWorkflowsId } from '@/services/-admin-workflows-{id}-patch';
import {
  getGetWorkflowsKeyQueryKey,
  useGetWorkflowsKey
} from '@/services/-workflows-{key}-get';

interface WorkflowEditorProps {
  workflowKey: string;
}

export function WorkflowEditor({ workflowKey }: WorkflowEditorProps) {
  const queryClient = useQueryClient();
  const resetEditor = useWorkflowEditorStore((s) => s.reset);
  const { data, isLoading, isFetching, refetch, error } = useGetWorkflowsKey(workflowKey);
  const definition = data?.data;
  const { mutateAsync: patchWorkflow } = usePatchAdminWorkflowsId();

  const [nodes, setNodes, onNodesChange] = useNodesState<Node<WorkflowStateNodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge<WorkflowTransitionEdgeData>>([]);

  useEffect(() => {
    return () => resetEditor();
  }, [resetEditor]);

  useEffect(() => {
    if (!definition) return;
    const saved = readSavedLayout(workflowKey);
    const graph = definitionToGraph(definition, saved);
    setNodes(graph.nodes);
    setEdges(graph.edges);
  }, [definition, setEdges, setNodes, workflowKey]);

  const toggleActive = async (checked: boolean) => {
    if (!definition?.id) return;
    try {
      const result = await patchWorkflow({
        id: definition.id,
        data: { is_active: checked }
      });
      if (!result.success) {
        toast.error(result.message ?? 'Failed to update workflow');
        return;
      }
      toast.success(checked ? 'Workflow activated' : 'Workflow deactivated');
      await queryClient.invalidateQueries({ queryKey: getGetWorkflowsKeyQueryKey(workflowKey) });
    } catch {
      toast.error('Failed to update workflow');
    }
  };

  if (isLoading) {
    return (
      <div className='space-y-4'>
        <Skeleton className='h-10 w-64' />
        <Skeleton className='h-[520px] w-full rounded-xl' />
      </div>
    );
  }

  if (error || !definition?.id) {
    return (
      <div className='flex flex-col items-start gap-4 py-12'>
        <p className='text-muted-foreground'>Workflow &quot;{workflowKey}&quot; was not found.</p>
        <Button asChild variant='outline'>
          <Link href='/dashboard/workflows'>
            <IconArrowLeft size={16} />
            Back to workflows
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <Button asChild variant='ghost' size='icon'>
            <Link href='/dashboard/workflows' aria-label='Back to workflows'>
              <IconArrowLeft size={18} />
            </Link>
          </Button>
          <div>
            <div className='flex flex-wrap items-center gap-2'>
              <h1 className='text-xl font-semibold tracking-tight'>{definition.name}</h1>
              <Badge variant='secondary' className='font-mono text-xs'>
                {definition.key}
              </Badge>
              <Badge variant='outline'>{definition.entity_type}</Badge>
            </div>
            {definition.description ? (
              <p className='text-muted-foreground mt-1 text-sm'>{definition.description}</p>
            ) : null}
          </div>
        </div>
        <div className='flex items-center gap-3 rounded-lg border px-3 py-2'>
          <span className='text-sm'>Active</span>
          <Switch
            checked={definition.is_active !== false}
            onCheckedChange={(checked) => void toggleActive(checked)}
            aria-label='Toggle workflow active'
          />
        </div>
      </div>

      <WorkflowCanvas
        workflowKey={workflowKey}
        definition={definition}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        setNodes={setNodes}
        onRefresh={() => void refetch()}
        isRefreshing={isFetching}
      />

      <WorkflowEditorPanels
        workflowId={definition.id}
        workflowKey={workflowKey}
        definition={definition}
      />
    </div>
  );
}
