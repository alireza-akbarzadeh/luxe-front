'use client';

import { BaseEdge, EdgeLabelRenderer, type EdgeProps, getBezierPath } from '@xyflow/react';

import type { WorkflowTransitionEdgeData } from '@/domains/workflows/types';
import { cn } from '@/lib/utils';

export function WorkflowTransitionEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
  style,
  selected
}: EdgeProps) {
  const edgeData = data as WorkflowTransitionEdgeData | undefined;
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  });

  const isActive = edgeData?.isActive !== false;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: selected ? 'hsl(var(--primary))' : isActive ? '#6366f1' : '#94a3b8',
          strokeWidth: selected ? 2.5 : 2,
          opacity: isActive ? 1 : 0.5
        }}
      />
      <EdgeLabelRenderer>
        <div
          className='nodrag nopan pointer-events-none absolute z-[1000]'
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`
          }}
        >
          <div
            className={cn(
              'flex max-w-[148px] flex-col items-center gap-0.5 rounded-lg border bg-card px-2.5 py-1.5 shadow-lg',
              selected && 'border-primary ring-primary/25 ring-2',
              !isActive && 'opacity-60'
            )}
          >
            <span className='truncate font-mono text-[10px] font-semibold tracking-tight'>
              {edgeData?.event}
            </span>
            {edgeData?.name && edgeData.name !== edgeData.event ? (
              <span className='text-muted-foreground truncate text-[9px]'>{edgeData.name}</span>
            ) : null}
            <div className='flex flex-wrap justify-center gap-1'>
              {edgeData?.isWildcard ? (
                <span className='rounded-full bg-slate-500/15 px-1.5 py-px text-[8px] font-semibold uppercase text-slate-600 dark:text-slate-300'>
                  any
                </span>
              ) : null}
              {edgeData?.requiredRole ? (
                <span className='rounded-full bg-amber-500/15 px-1.5 py-px text-[8px] font-semibold uppercase text-amber-700 dark:text-amber-400'>
                  {edgeData.requiredRole}
                </span>
              ) : null}
              {edgeData?.guardKey ? (
                <span className='rounded-full bg-blue-500/15 px-1.5 py-px text-[8px] font-medium text-blue-700 dark:text-blue-300'>
                  guard
                </span>
              ) : null}
              {edgeData?.hookKey ? (
                <span className='rounded-full bg-emerald-500/15 px-1.5 py-px text-[8px] font-medium text-emerald-700 dark:text-emerald-300'>
                  hook
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
