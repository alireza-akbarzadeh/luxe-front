'use client';

import { formatDistanceToNowStrict } from 'date-fns';

import { cn } from '@/lib/utils';

import { EVENT_TYPE_META } from '../constants';
import type { SaleEvent } from '../sales-store';

function formatEventTime(timestamp: SaleEvent['timestamp']): string {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  if (Number.isNaN(date.getTime())) return 'just now';
  return formatDistanceToNowStrict(date, { addSuffix: true });
}

export function LiveEventFeed({
  events,
  maxVisible = 30
}: {
  events: SaleEvent[];
  maxVisible?: number;
}) {
  if (events.length === 0) {
    return (
      <div className='text-muted-foreground flex h-40 items-center justify-center text-sm'>
        Waiting for live activity…
      </div>
    );
  }

  return (
    <div className='flex max-h-[480px] flex-col gap-0 overflow-y-auto pr-1'>
      {events.slice(0, maxVisible).map((evt, i) => {
        const meta = EVENT_TYPE_META[evt.type] ?? EVENT_TYPE_META.status_change;

        return (
          <div
            key={evt.id}
            className={cn(
              'flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors',
              i === 0 ? 'bg-primary/5 border-primary/10 border' : 'hover:bg-muted/40'
            )}
          >
            <div
              className={cn(
                'mt-0.5 shrink-0 rounded-lg px-2 py-0.5 text-[9px] font-black tracking-widest uppercase',
                meta.bg,
                meta.color
              )}
            >
              {meta.label}
            </div>
            <div className='min-w-0 flex-1'>
              <p className='truncate text-[12px] leading-tight font-semibold'>{evt.title}</p>
              <p className='text-muted-foreground truncate text-[10px]'>{evt.subtitle}</p>
            </div>
            <div className='text-muted-foreground shrink-0 text-[9px] font-bold whitespace-nowrap tabular-nums'>
              {formatEventTime(evt.timestamp)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
