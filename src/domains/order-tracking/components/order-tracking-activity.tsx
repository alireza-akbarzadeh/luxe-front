'use client';

import {
  IconCheckbox,
  IconCreditCard,
  IconPackage,
  IconTimeline,
  IconTruck,
  IconX
} from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';

import { cn } from '@/lib/utils';

import type { OrderTrackingActivity } from '../lib/order-tracking-utils';

interface OrderTrackingActivityFeedProps {
  activities: OrderTrackingActivity[];
  className?: string;
}

function getActivityIcon(type: string) {
  switch (type) {
    case 'payment_succeeded':
      return IconCreditCard;
    case 'payment_failed':
      return IconX;
    case 'shipment_processing':
      return IconPackage;
    case 'shipment_shipped':
      return IconTruck;
    case 'order_status_update':
      return IconCheckbox;
    default:
      return IconTimeline;
  }
}

function getActivityTone(type: string) {
  switch (type) {
    case 'payment_succeeded':
    case 'shipment_shipped':
      return 'border-green-500/20 bg-green-500/5 text-green-700 dark:text-green-400';
    case 'payment_failed':
      return 'border-red-500/20 bg-red-500/5 text-red-700 dark:text-red-400';
    case 'shipment_processing':
      return 'border-blue-500/20 bg-blue-500/5 text-blue-700 dark:text-blue-400';
    default:
      return 'border-border/60 bg-muted/30 text-foreground';
  }
}

/** Live activity feed driven by WebSocket order events. */
export function OrderTrackingActivityFeed({
  activities,
  className
}: OrderTrackingActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn('bg-card border-border/50 rounded-2xl border p-6', className)}
      >
        <div className='mb-4 flex items-center gap-2'>
          <IconTimeline className='text-accent h-5 w-5' />
          <h3 className='font-semibold'>Live activity</h3>
        </div>
        <p className='text-muted-foreground text-sm'>
          Updates will appear here as your order moves through each stage.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('bg-card border-border/50 rounded-2xl border p-6', className)}
    >
      <div className='mb-4 flex items-center gap-2'>
        <IconTimeline className='text-accent h-5 w-5' />
        <h3 className='font-semibold'>Live activity</h3>
      </div>

      <ul className='space-y-3'>
        <AnimatePresence initial={false}>
          {activities.map((activity, index) => {
            const Icon = getActivityIcon(activity.type);

            return (
              <motion.li
                key={activity.id}
                layout
                initial={{ opacity: 0, x: -12, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: 12, height: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                className={cn(
                  'flex gap-3 rounded-xl border p-3',
                  getActivityTone(activity.type),
                  index === 0 && 'ring-accent/20 ring-1'
                )}
              >
                <div className='bg-background/80 flex h-9 w-9 shrink-0 items-center justify-center rounded-full'>
                  <Icon className='h-4 w-4' />
                </div>
                <div className='min-w-0 flex-1'>
                  <div className='flex items-start justify-between gap-2'>
                    <p className='text-sm font-medium'>{activity.title}</p>
                    <time
                      className='text-muted-foreground shrink-0 text-xs whitespace-nowrap'
                      dateTime={new Date(activity.timestamp).toISOString()}
                    >
                      {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                    </time>
                  </div>
                  <p className='text-muted-foreground mt-0.5 text-sm'>{activity.message}</p>
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </motion.div>
  );
}
