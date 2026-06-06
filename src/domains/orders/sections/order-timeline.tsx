import {
  IconAlertCircle,
  IconCircleCheck,
  IconCircleX,
  IconClock,
  IconCreditCard,
  IconPackage,
  IconSearch,
  IconShoppingCart,
  IconTruck
} from '@tabler/icons-react';
import { format } from 'date-fns';
import * as React from 'react';

import { cn } from '@/lib/utils';

// 1. Explicitly type your domain's allowed timeline statuses
export type TimelineEventName =
  | 'Order Placed'
  | 'Payment Confirmed'
  | 'Payment Partial'
  | 'Awaiting Payment'
  | 'Processing'
  | 'Fulfilled'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Return Initiated'
  | 'Refunded';

// 2. Define the exact shape of a timeline data node
export interface TimelineEvent {
  event: TimelineEventName | string; // Allows unknown legacy strings while maintaining autocompletion
  timestamp: string | Date;
  description?: string | null;
  actor?: string | null;
}

export interface OrderTimelineProps {
  timeline: TimelineEvent[];
}

interface EventConfigItem {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  line: string;
}

// 3. Map events statically with strict config typing
const EVENT_CONFIG: Record<TimelineEventName, EventConfigItem> = {
  'Order Placed': {
    icon: IconShoppingCart,
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400',
    line: 'bg-blue-200 dark:bg-blue-900/40'
  },
  'Payment Confirmed': {
    icon: IconCreditCard,
    color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
    line: 'bg-emerald-200 dark:bg-emerald-900/40'
  },
  'Payment Partial': {
    icon: IconCreditCard,
    color: 'bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400',
    line: 'bg-amber-200 dark:bg-amber-900/40'
  },
  'Awaiting Payment': {
    icon: IconClock,
    color: 'bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400',
    line: 'bg-amber-200 dark:bg-amber-900/40'
  },
  Processing: {
    icon: IconPackage,
    color: 'bg-violet-100 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400',
    line: 'bg-violet-200 dark:bg-violet-900/40'
  },
  Fulfilled: {
    icon: IconCircleCheck,
    color: 'bg-sky-100 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400',
    line: 'bg-sky-200 dark:bg-sky-900/40'
  },
  Shipped: {
    icon: IconTruck,
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400',
    line: 'bg-blue-200 dark:bg-blue-900/40'
  },
  'Out for Delivery': {
    icon: IconTruck,
    color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400',
    line: 'bg-indigo-200 dark:bg-indigo-900/40'
  },
  Delivered: {
    icon: IconCircleCheck,
    color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
    line: 'bg-emerald-200 dark:bg-emerald-900/40'
  },
  Cancelled: {
    icon: IconCircleX,
    color: 'bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400',
    line: 'bg-red-200 dark:bg-red-900/40'
  },
  'Return Initiated': {
    icon: IconSearch,
    color: 'bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400',
    line: 'bg-orange-200 dark:bg-orange-900/40'
  },
  Refunded: {
    icon: IconSearch,
    color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    line: 'bg-gray-200 dark:bg-gray-700'
  }
};

const DEFAULT_CONFIG: EventConfigItem = {
  icon: IconAlertCircle,
  color: 'bg-muted text-muted-foreground',
  line: 'bg-border'
};

export function OrderTimeline({ timeline }: OrderTimelineProps) {
  return (
    <div className='bg-card border-border/40 overflow-hidden rounded-2xl border shadow-sm'>
      <div className='bg-muted/20 border-border/10 border-b px-6 py-4'>
        <h2 className='text-muted-foreground text-[10px] font-black tracking-widest uppercase'>
          Order Timeline
        </h2>
      </div>
      <div className='p-6'>
        <div className='relative space-y-0'>
          {timeline.map((event, idx) => {
            // Lookup config using type-safe keys with a fallback strategy
            const config = EVENT_CONFIG[event.event as TimelineEventName] || DEFAULT_CONFIG;
            const Icon = config.icon;
            const isLast = idx === timeline.length - 1;
            const eventDate = new Date(event.timestamp);

            return (
              <div key={idx} className='relative flex gap-4'>
                {/* Line */}
                {!isLast && (
                  <div
                    className={cn('absolute top-9 bottom-0 left-4 w-0.5', config.line)}
                    style={{ transform: 'translateX(-50%)' }}
                  />
                )}

                {/* Icon */}
                <div
                  className={cn(
                    'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-transparent transition-colors',
                    config.color
                  )}
                >
                  <Icon className='h-3.5 w-3.5' />
                </div>

                {/* Content */}
                <div className={cn('flex-1 pb-6', isLast && 'pb-0')}>
                  <div className='flex items-start justify-between gap-2'>
                    <div>
                      <p className='text-foreground text-xs leading-tight font-bold'>
                        {event.event}
                      </p>
                      {event.description && (
                        <p className='text-muted-foreground mt-0.5 text-[11px] leading-relaxed'>
                          {event.description}
                        </p>
                      )}
                    </div>
                    <div className='shrink-0 text-right'>
                      <p className='text-muted-foreground text-[10px] font-semibold whitespace-nowrap tabular-nums'>
                        {format(eventDate, 'MMM d, yyyy')}
                      </p>
                      <p className='text-muted-foreground text-[10px] tabular-nums'>
                        {format(eventDate, 'h:mm a')}
                      </p>
                      {event.actor && (
                        <p className='bg-secondary text-secondary-foreground border-border/20 mt-1 inline-block rounded-full border px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase'>
                          {event.actor}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
