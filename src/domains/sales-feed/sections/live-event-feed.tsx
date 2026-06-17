'use client';
import { formatDistanceToNowStrict } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

import { EVENT_TYPE_META } from '../constants';
import type { SaleEvent } from '../sales-store';

export function LiveEventFeed({
  events,
  maxVisible = 30
}: {
  events: SaleEvent[];
  maxVisible?: number;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [events.length]);

  return (
    <div ref={listRef} className='flex max-h-[480px] flex-col gap-0 overflow-y-auto pr-1'>
      <AnimatePresence initial={false}>
        {events.slice(0, maxVisible).map((evt, i) => {
          const meta = EVENT_TYPE_META[evt.type];
          const timestamp = evt.timestamp instanceof Date ? evt.timestamp : new Date(evt.timestamp);
          return (
            <motion.div
              key={evt.id}
              layout
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
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
                {formatDistanceToNowStrict(timestamp, { addSuffix: true })}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
