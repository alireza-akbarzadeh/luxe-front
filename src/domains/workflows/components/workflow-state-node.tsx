'use client';

import {
  IconArrowDownLeft,
  IconArrowUpRight,
  IconEdit,
  IconFlag,
  IconPlayerPlay,
  IconShield,
  IconSparkles,
  type TablerIcon
} from '@tabler/icons-react';
import { Handle, type NodeProps, Position } from '@xyflow/react';

import { useWorkflowEditorStore } from '@/domains/workflows/stores/workflow-editor-store';
import type { WorkflowAnyNodeData, WorkflowStateNodeData } from '@/domains/workflows/types';
import { cn } from '@/lib/utils';

function stateTypeLabel(data: WorkflowStateNodeData) {
  if (data.isInitial) return 'Initial';
  if (data.isFinal) return 'Final';
  return 'State';
}

function EventPills({ events, max = 3 }: { events: string[]; max?: number }) {
  if (events.length === 0) {
    return <span className='text-[10px] opacity-60 italic'>No outgoing events</span>;
  }

  const visible = events.slice(0, max);
  const remaining = events.length - visible.length;

  return (
    <div className='flex flex-wrap gap-1'>
      {visible.map((event) => (
        <span
          key={event}
          className='rounded-md bg-black/15 px-1.5 py-0.5 font-mono text-[9px] font-medium'
        >
          {event}
        </span>
      ))}
      {remaining > 0 ? (
        <span className='rounded-md bg-black/10 px-1.5 py-0.5 text-[9px] font-medium'>
          +{remaining}
        </span>
      ) : null}
    </div>
  );
}

function FlowStat({
  icon: Icon,
  label,
  value
}: {
  icon: TablerIcon;
  label: string;
  value: number;
}) {
  return (
    <div className='flex min-w-0 flex-1 items-center gap-1.5 rounded-lg bg-black/10 px-2 py-1.5'>
      <Icon size={12} className='shrink-0 opacity-80' />
      <div className='min-w-0'>
        <p className='text-[9px] leading-none font-medium uppercase opacity-70'>{label}</p>
        <p className='text-sm leading-tight font-semibold tabular-nums'>{value}</p>
      </div>
    </div>
  );
}

export function WorkflowStateNode({ data, selected }: NodeProps) {
  const nodeData = data as WorkflowStateNodeData;
  const openEditState = useWorkflowEditorStore((s) => s.openEditState);

  return (
    <div
      className={cn(
        'group/node relative w-[260px] min-w-[260px] overflow-hidden rounded-2xl border shadow-lg transition-all duration-200',
        selected
          ? 'border-white/40 ring-primary/40 shadow-primary/25 z-10 ring-4'
          : 'border-white/20 z-0 hover:shadow-xl'
      )}
      style={{
        backgroundColor: nodeData.color,
        color: nodeData.textColor,
        boxShadow: selected
          ? `0 20px 40px -12px ${nodeData.color}88`
          : `0 10px 24px -10px ${nodeData.color}66`
      }}
    >
      <div className='absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-black/10' />

      <Handle
        type='target'
        position={Position.Left}
        className='!size-4 !border-2 !border-white/90 !bg-slate-900 transition-transform group-hover/node:scale-110'
      />

      <div className='relative px-4 pt-3 pb-11'>
        <div className='mb-3 flex items-center justify-between gap-2'>
          <span className='inline-flex items-center gap-1 rounded-full bg-black/20 px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase'>
            {nodeData.isInitial ? <IconPlayerPlay size={10} /> : null}
            {nodeData.isFinal ? <IconFlag size={10} /> : null}
            {stateTypeLabel(nodeData)}
          </span>
          <span className='rounded-full bg-black/15 px-2 py-0.5 font-mono text-[10px] opacity-80'>
            #{nodeData.sortOrder}
          </span>
        </div>

        <div className='space-y-0.5'>
          <p className='truncate text-base leading-tight font-semibold'>{nodeData.name}</p>
          <p className='truncate font-mono text-[11px] opacity-75'>{nodeData.code}</p>
        </div>

        <div className='mt-3 flex gap-2'>
          <FlowStat icon={IconArrowUpRight} label='Out' value={nodeData.outgoingCount} />
          <FlowStat icon={IconArrowDownLeft} label='In' value={nodeData.incomingCount} />
        </div>

        <div className='mt-3 rounded-xl bg-black/10 p-2.5'>
          <p className='mb-1.5 text-[9px] font-semibold tracking-wider uppercase opacity-70'>
            Exits
          </p>
          <EventPills events={nodeData.outgoingEvents} />
        </div>

        {(nodeData.hasAdminExit || nodeData.hasGuardedExit || nodeData.hasHookExit) && (
          <div className='mt-2 flex flex-wrap gap-1'>
            {nodeData.hasAdminExit ? (
              <span className='inline-flex items-center gap-1 rounded-full bg-black/20 px-2 py-0.5 text-[9px] font-medium'>
                <IconShield size={10} />
                Admin
              </span>
            ) : null}
            {nodeData.hasGuardedExit ? (
              <span className='inline-flex items-center gap-1 rounded-full bg-black/20 px-2 py-0.5 text-[9px] font-medium'>
                Guard
              </span>
            ) : null}
            {nodeData.hasHookExit ? (
              <span className='inline-flex items-center gap-1 rounded-full bg-black/20 px-2 py-0.5 text-[9px] font-medium'>
                <IconSparkles size={10} />
                Hook
              </span>
            ) : null}
          </div>
        )}
      </div>

      <button
        type='button'
        className='absolute inset-x-3 bottom-3 flex items-center justify-center gap-1.5 rounded-lg bg-black/25 px-3 py-2 text-[11px] font-medium opacity-0 backdrop-blur-sm transition-opacity group-hover/node:opacity-100 hover:bg-black/35'
        onClick={(e) => {
          e.stopPropagation();
          openEditState(nodeData.stateForEdit);
        }}
      >
        <IconEdit size={13} />
        Edit state
      </button>

      <Handle
        type='source'
        position={Position.Right}
        className='!size-4 !border-2 !border-white/90 !bg-slate-900 transition-transform group-hover/node:scale-110'
      />
    </div>
  );
}

export function WorkflowAnyNode({ data, selected }: NodeProps) {
  const nodeData = data as WorkflowAnyNodeData;
  const outgoing = nodeData.wildcardOutgoingCount ?? 0;
  const events = nodeData.outgoingEvents ?? [];

  return (
    <div
      className={cn(
        'group/node relative min-w-[200px] overflow-hidden rounded-2xl border border-dashed border-indigo-400/70 bg-linear-to-br from-slate-900 via-slate-900 to-indigo-950 text-slate-100 shadow-lg',
        selected && 'border-primary ring-primary/30 z-10 scale-[1.02] ring-4'
      )}
    >
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.25),transparent_55%)]' />

      <Handle
        type='source'
        position={Position.Bottom}
        className='!size-4 !border-2 !border-white/90 !bg-indigo-500 transition-transform group-hover/node:scale-110'
      />

      <div className='relative px-4 py-4'>
        <span className='inline-flex rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-indigo-200 uppercase'>
          Wildcard
        </span>
        <p className='mt-2 text-sm font-semibold'>Any state</p>
        <p className='mt-0.5 text-[11px] text-slate-400'>Applies from every state</p>

        <div className='mt-3 flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2'>
          <IconArrowUpRight size={14} className='text-indigo-300' />
          <div>
            <p className='text-[9px] tracking-wider text-slate-400 uppercase'>Wildcard exits</p>
            <p className='text-lg leading-none font-semibold tabular-nums'>{outgoing}</p>
          </div>
        </div>

        {events.length > 0 ? (
          <div className='mt-2 rounded-xl bg-white/5 p-2'>
            <EventPills events={events} max={2} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
