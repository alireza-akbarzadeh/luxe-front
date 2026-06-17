'use client';

import { IconArrowLeft } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { type Edge, type Node, useEdgesState, useNodesState } from '@xyflow/react';
import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { WorkflowCanvas } from '@/domains/workflows/components/workflow-canvas';
import { WorkflowEditorPanels } from '@/domains/workflows/components/workflow-editor-panels';
import { definitionToGraph, readSavedLayout } from '@/domains/workflows/lib/workflow-graph';
import { useWorkflowEditorStore } from '@/domains/workflows/stores/workflow-editor-store';
import type { WorkflowNodeData, WorkflowTransitionEdgeData } from '@/domains/workflows/types';
import { usePatchAdminWorkflowsId } from '@/services/-admin-workflows-{id}-patch';
import { getGetWorkflowsKeyQueryKey, useGetWorkflowsKey } from '@/services/-workflows-{key}-get';

interface WorkflowEditorProps {
  workflowKey: string;
}

export function WorkflowEditor({ workflowKey }: WorkflowEditorProps) {
  const queryClient = useQueryClient();
  const resetEditor = useWorkflowEditorStore((s) => s.reset);
  const { data, isLoading, isFetching, refetch, error } = useGetWorkflowsKey(workflowKey);
  const definition = data?.data;
  const { mutateAsync: patchWorkflow } = usePatchAdminWorkflowsId();

  const [nodes, setNodes, onNodesChange] = useNodesState<Node<WorkflowNodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge<WorkflowTransitionEdgeData>>([]);

  const stats = useMemo(() => {
    const states = definition?.states?.length ?? 0;
    const transitions = definition?.transitions?.length ?? 0;
    return { states, transitions };
  }, [definition?.states, definition?.transitions]);

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
        <Skeleton className='h-20 w-full' />
        <Skeleton className='h-[560px] w-full rounded-2xl' />
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

  const isActive = definition.is_active !== false;

  return (
    <div className='space-y-3'>
      <div className='border-b pb-2'>
        <div className='flex flex-wrap items-start justify-between gap-4'>
          <div className='flex min-w-0 items-start gap-3'>
            <Button asChild variant='ghost' size='icon' className='mt-0.5 shrink-0'>
              <Link href='/dashboard/workflows' aria-label='Back to workflows'>
                <IconArrowLeft size={18} />
              </Link>
            </Button>
            <div className='min-w-0 space-y-1'>
              <div className='flex flex-wrap items-center gap-x-3 gap-y-1'>
                <h1 className='text-2xl font-semibold tracking-tight'>{definition.name}</h1>
                <Badge variant='secondary' className='font-mono text-xs font-normal'>
                  {definition.key}
                </Badge>
                <Badge variant='outline' className='capitalize'>
                  {definition.entity_type}
                </Badge>
              </div>
              <p className='text-muted-foreground max-w-3xl text-sm leading-relaxed'>
                {definition.description ??
                  `Manage states and transitions for the ${definition.entity_type} lifecycle.`}
              </p>
              <p className='text-muted-foreground text-xs'>
                {stats.states} states · {stats.transitions} transitions
              </p>
            </div>
          </div>

          <div className='flex items-center gap-2.5 rounded-lg border px-3 py-2'>
            <Label htmlFor='workflow-active-toggle' className='text-sm font-medium'>
              Active
            </Label>
            <Switch
              id='workflow-active-toggle'
              checked={isActive}
              onCheckedChange={(checked) => void toggleActive(checked)}
            />
          </div>
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
