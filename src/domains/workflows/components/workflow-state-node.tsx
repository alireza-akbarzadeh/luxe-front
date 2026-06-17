'use client';

import { IconFlag, IconPlayerPlay } from '@tabler/icons-react';
import { Handle, type NodeProps,Position } from '@xyflow/react';

import type { WorkflowStateNodeData } from '@/domains/workflows/types';
import { cn } from '@/lib/utils';

export function WorkflowStateNode({ data, selected }: NodeProps) {
  const nodeData = data as WorkflowStateNodeData;

  return (
    <div
      className={cn(
        'min-w-[200px] rounded-xl border-2 shadow-lg transition-shadow',
        selected ? 'ring-primary ring-2 ring-offset-2' : 'border-transparent'
      )}
      style={{ backgroundColor: nodeData.color, color: nodeData.textColor }}
    >
      <Handle
        type='target'
        position={Position.Left}
        className='!size-3 !border-2 !border-white !bg-slate-900'
      />
      <div className='px-4 py-3'>
        <div className='flex items-start justify-between gap-2'>
          <div className='min-w-0'>
            <p className='truncate text-sm font-semibold'>{nodeData.name}</p>
            <p className='truncate font-mono text-[11px] opacity-80'>{nodeData.code}</p>
          </div>
          <div className='flex shrink-0 gap-1'>
            {nodeData.isInitial ? (
              <span
                className='rounded-full bg-black/20 p-1'
                title='Initial state'
                aria-label='Initial state'
              >
                <IconPlayerPlay size={12} />
              </span>
            ) : null}
            {nodeData.isFinal ? (
              <span
                className='rounded-full bg-black/20 p-1'
                title='Final state'
                aria-label='Final state'
              >
                <IconFlag size={12} />
              </span>
            ) : null}
          </div>
        </div>
      </div>
      <Handle
        type='source'
        position={Position.Right}
        className='!size-3 !border-2 !border-white !bg-slate-900'
      />
    </div>
  );
}

export function WorkflowAnyNode({ selected }: NodeProps) {
  return (
    <div
      className={cn(
        'min-w-[160px] rounded-xl border border-dashed border-slate-400 bg-slate-900 px-4 py-3 text-slate-100 shadow-md',
        selected && 'ring-primary ring-2 ring-offset-2'
      )}
    >
      <Handle
        type='source'
        position={Position.Bottom}
        className='!size-3 !border-2 !border-white !bg-indigo-500'
      />
      <p className='text-sm font-medium'>Any state</p>
      <p className='text-[11px] text-slate-400'>Wildcard transitions</p>
    </div>
  );
}
