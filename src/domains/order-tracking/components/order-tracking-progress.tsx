'use client';

import { IconCheckbox, IconMail, IconPackage, IconTruck, IconX } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';

import { cn } from '@/lib/utils';

import type { OrderProgressState, OrderProgressStep } from '../lib/order-tracking-utils';

const STEP_ICONS = {
  confirmed: IconCheckbox,
  processing: IconPackage,
  shipped: IconTruck,
  delivered: IconMail
} as const;

interface OrderTrackingProgressProps {
  progress: OrderProgressState;
  pulsingStepKey?: string | null;
  onPulseComplete?: () => void;
}

function StepNode({
  step,
  index,
  isPulsing
}: {
  step: OrderProgressStep;
  index: number;
  isPulsing: boolean;
}) {
  const Icon = STEP_ICONS[step.key as keyof typeof STEP_ICONS] ?? IconPackage;
  const isCompleted = step.status === 'completed';
  const isActive = step.status === 'active';
  const isCancelled = step.status === 'cancelled';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.08, type: 'spring', stiffness: 240, damping: 22 }}
      className='relative flex flex-col items-center text-center'
    >
      <div className='relative mb-3'>
        <AnimatePresence>
          {isPulsing && (
            <motion.span
              key='pulse-ring'
              initial={{ scale: 0.8, opacity: 0.7 }}
              animate={{ scale: 1.8, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, repeat: 2, ease: 'easeOut' }}
              className={cn(
                'absolute inset-0 rounded-full',
                isCancelled ? 'bg-red-500/30' : 'bg-green-500/30'
              )}
            />
          )}
        </AnimatePresence>

        <motion.div
          layout
          animate={
            isActive && !isCancelled
              ? {
                  scale: [1, 1.06, 1],
                  boxShadow: [
                    '0 0 0 0 rgba(34,197,94,0)',
                    '0 0 0 8px rgba(34,197,94,0.15)',
                    '0 0 0 0 rgba(34,197,94,0)'
                  ]
                }
              : isPulsing
                ? { scale: [1, 1.12, 1] }
                : { scale: 1 }
          }
          transition={
            isActive
              ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0.45, type: 'spring', stiffness: 280 }
          }
          className={cn(
            'relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors',
            isCompleted && 'border-green-500 bg-green-500 text-white',
            isActive && !isCancelled && 'border-green-500 bg-green-500/15 text-green-600',
            step.status === 'upcoming' && 'border-muted bg-muted text-muted-foreground',
            isCancelled && 'border-red-500/40 bg-red-500/10 text-red-600'
          )}
        >
          {isCancelled ? <IconX className='h-5 w-5' /> : <Icon className='h-5 w-5' />}
        </motion.div>
      </div>

      <motion.p
        layout
        className={cn(
          'text-sm font-medium',
          (isCompleted || isActive) && !isCancelled ? 'text-foreground' : 'text-muted-foreground',
          isCancelled && 'text-red-600'
        )}
      >
        {step.title}
      </motion.p>
      <motion.p layout className='text-muted-foreground mt-1 px-1 text-xs sm:hidden'>
        {step.status === 'active' || step.status === 'completed' ? step.description : null}
      </motion.p>
      <motion.p layout className='text-muted-foreground mt-1 hidden px-1 text-xs sm:block'>
        {step.description}
      </motion.p>
    </motion.div>
  );
}

/** Animated multi-step order progress bar with live pulse on WebSocket updates. */
export function OrderTrackingProgress({
  progress,
  pulsingStepKey,
  onPulseComplete
}: OrderTrackingProgressProps) {
  const { steps, progressPercent, isTerminal, terminalType } = progress;

  useEffect(() => {
    if (!pulsingStepKey || !onPulseComplete) return undefined;

    const timer = setTimeout(onPulseComplete, 2400);
    return () => clearTimeout(timer);
  }, [pulsingStepKey, onPulseComplete]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className='mb-12'
      aria-label='Order progress'
    >
      <div className='mb-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-between'>
        <h2 className='text-lg font-semibold'>Order progress</h2>
        {isTerminal && (
          <p className='text-sm font-medium text-red-600 capitalize'>
            {terminalType === 'refunded' ? 'Refunded' : 'Cancelled'}
          </p>
        )}
      </div>

      <div className='relative px-1 sm:px-4'>
        <div className='bg-border absolute top-6 right-4 left-4 h-1 overflow-hidden rounded-full sm:right-8 sm:left-8'>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ type: 'spring', stiffness: 90, damping: 18, mass: 0.8 }}
            className={cn(
              'h-full rounded-full',
              isTerminal
                ? 'bg-red-500/60'
                : 'bg-gradient-to-r from-green-500 via-emerald-500 to-green-400'
            )}
          />
          {!isTerminal && (
            <motion.div
              animate={{ x: ['-30%', '130%'] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'linear', repeatDelay: 0.6 }}
              className='absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent'
              style={{ width: `${Math.max(20, progressPercent)}%`, maxWidth: '40%' }}
            />
          )}
        </div>

        <div className='relative grid grid-cols-2 gap-y-8 sm:grid-cols-4 sm:gap-y-0'>
          {steps.map((step, index) => (
            <StepNode
              key={step.key}
              step={step}
              index={index}
              isPulsing={pulsingStepKey === step.key}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
