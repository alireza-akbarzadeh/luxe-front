'use client';

import { IconArrowRight, IconCircleCheck, IconCircleX } from '@tabler/icons-react';

import { Skeleton } from '@/components/ui/skeleton';
import { DATE_FORMATS, formatDate } from '@/lib/date';
import { cn } from '@/lib/utils';

import type { WorkflowHistoryEntry } from '../types/workflow-runtime.types';
import { WorkflowStateBadge } from './workflow-state-badge';

interface WorkflowHistoryTimelineProps {
  entries: WorkflowHistoryEntry[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function WorkflowHistoryTimeline({
  entries,
  isLoading = false,
  emptyMessage = 'No workflow activity yet.'
}: WorkflowHistoryTimelineProps) {
  if (isLoading) {
    return (
      <div className='space-y-3'>
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className='h-14 w-full rounded-lg' />
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <p className='text-muted-foreground rounded-lg border border-dashed px-4 py-6 text-center text-sm'>
        {emptyMessage}
      </p>
    );
  }

  return (
    <ol className='relative space-y-0'>
      {entries.map((entry, index) => {
        const isLast = index === entries.length - 1;
        const failed = entry.success === false;

        return (
          <li key={entry.id ?? `${entry.event}-${entry.created_at}-${index}`} className='relative flex gap-3 pb-6'>
            {!isLast ? (
              <span
                className='bg-border absolute top-8 left-[11px] h-[calc(100%-1rem)] w-px'
                aria-hidden
              />
            ) : null}

            <div
              className={cn(
                'relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full',
                failed
                  ? 'bg-destructive/15 text-destructive'
                  : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
              )}
            >
              {failed ? <IconCircleX className='size-3.5' /> : <IconCircleCheck className='size-3.5' />}
            </div>

            <div className='min-w-0 flex-1 space-y-1.5'>
              <div className='flex flex-wrap items-center gap-2'>
                <span className='text-sm font-medium'>{entry.event ?? 'transition'}</span>
                {entry.from_state || entry.to_state ? (
                  <span className='text-muted-foreground flex items-center gap-1 text-xs'>
                    {entry.from_state ? (
                      <WorkflowStateBadge state={entry.from_state} className='text-[10px]' />
                    ) : null}
                    <IconArrowRight className='size-3' />
                    {entry.to_state ? (
                      <WorkflowStateBadge state={entry.to_state} className='text-[10px]' />
                    ) : null}
                  </span>
                ) : null}
              </div>

              <p className='text-muted-foreground text-xs'>
                {entry.created_at
                  ? formatDate(entry.created_at, DATE_FORMATS.WITH_TIME)
                  : '—'}
                {entry.user_name ? ` · ${entry.user_name}` : ''}
              </p>

              {entry.note ? (
                <p className='text-muted-foreground bg-muted/40 rounded-md px-2 py-1 text-xs'>
                  {entry.note}
                </p>
              ) : null}

              {failed && entry.error_msg ? (
                <p className='text-destructive text-xs'>{entry.error_msg}</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
