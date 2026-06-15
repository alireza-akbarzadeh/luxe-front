'use client';

import { IconLoader2, IconWifi, IconWifiOff } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';

interface OrderTrackingLiveBadgeProps {
  connectionStatus: ConnectionStatus;
  className?: string;
}

/** Shows WebSocket connection health for live order updates. */
export function OrderTrackingLiveBadge({
  connectionStatus,
  className
}: OrderTrackingLiveBadgeProps) {
  const isLive = connectionStatus === 'connected';
  const isConnecting = connectionStatus === 'connecting';

  return (
    <AnimatePresence mode='wait'>
      <motion.div
        key={connectionStatus}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 4 }}
        className={className}
      >
        <Badge
          variant='outline'
          className={cn(
            'gap-1.5 rounded-full px-3 py-1 font-normal',
            isLive && 'border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400',
            isConnecting &&
              'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400',
            !isLive &&
              !isConnecting &&
              'border-muted-foreground/20 bg-muted/40 text-muted-foreground'
          )}
        >
          {isLive ? (
            <>
              <span className='relative flex h-2 w-2'>
                <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60' />
                <span className='relative inline-flex h-2 w-2 rounded-full bg-green-500' />
              </span>
              <IconWifi className='h-3.5 w-3.5' />
              Live updates
            </>
          ) : isConnecting ? (
            <>
              <IconLoader2 className='h-3.5 w-3.5 animate-spin' />
              Connecting…
            </>
          ) : (
            <>
              <IconWifiOff className='h-3.5 w-3.5' />
              Reconnecting…
            </>
          )}
        </Badge>
      </motion.div>
    </AnimatePresence>
  );
}
