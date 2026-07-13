'use client';

import { IconCheckbox, IconPackage } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { DATE_FORMATS, formatDate } from '@/lib/date';
import { cn } from '@/lib/utils';

import type { OrderTrackingMilestone } from '../types/order-tracking.types';

interface OrderTrackingMilestonesProps {
  milestones: OrderTrackingMilestone[];
}

/** Workflow-driven delivery progress — vertical on mobile, horizontal scroll on desktop. */
export function OrderTrackingMilestones({ milestones }: OrderTrackingMilestonesProps) {
  const t = useTranslations('orderTracking.page');

  if (milestones.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 }}
      className='mb-8 sm:mb-10'
      aria-label={t('deliveryProgress')}
    >
      <Typography.H3 className='mb-4 text-lg sm:mb-6'>{t('deliveryProgress')}</Typography.H3>

      {/* Mobile: vertical timeline matching design */}
      <div className='bg-card border-border/60 relative rounded-2xl border p-4 sm:hidden'>
        <div className='bg-border absolute top-8 bottom-8 left-9 w-0.5' />
        <Flex direction='column' gap={0}>
          {milestones.map((step, index) => {
            const done = step.status === 'completed';
            const active = step.status === 'active';

            return (
              <Flex key={step.key} direction='row' gap={3} className='relative pb-5 last:pb-0'>
                <div
                  className={cn(
                    'relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-2',
                    done && 'border-green-500 bg-green-500 text-white',
                    active &&
                      'border-green-500 bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.45)]',
                    !done && !active && 'border-muted bg-muted/40 text-muted-foreground'
                  )}
                  style={
                    active && step.color
                      ? {
                          borderColor: step.color,
                          backgroundColor: step.color,
                          color: step.text_color
                        }
                      : undefined
                  }
                >
                  {done || active ? (
                    <IconCheckbox className='size-4' />
                  ) : (
                    <IconPackage className='size-4' />
                  )}
                </div>
                <div
                  className={cn(
                    'min-w-0 flex-1 rounded-xl px-3 py-2',
                    active && 'bg-green-500/10 ring-1 ring-green-500/30'
                  )}
                >
                  <Typography.Text weight='medium' className='text-sm'>
                    {step.title}
                  </Typography.Text>
                  {step.occurred_at ? (
                    <Typography.Subtle>
                      {formatDate(step.occurred_at, DATE_FORMATS.WITH_TIME)}
                    </Typography.Subtle>
                  ) : null}
                  {step.description ? (
                    <Typography.Subtle className={cn(step.occurred_at && 'mt-0.5')}>
                      {step.description}
                    </Typography.Subtle>
                  ) : null}
                </div>
                <span className='sr-only'>
                  Step {index + 1}: {step.status}
                </span>
              </Flex>
            );
          })}
        </Flex>
      </div>

      {/* Desktop: horizontal stepper */}
      <div className='bg-card border-border/60 relative hidden overflow-x-auto rounded-2xl border p-6 sm:block'>
        <div className='bg-border absolute top-[2.65rem] right-10 left-10 h-0.5' />
        <div
          className='relative grid gap-2'
          style={{
            gridTemplateColumns: `repeat(${milestones.length}, minmax(5.5rem, 1fr))`,
            minWidth: `${milestones.length * 5.5}rem`
          }}
        >
          {milestones.map((step) => {
            const done = step.status === 'completed';
            const active = step.status === 'active';

            return (
              <div key={step.key} className='flex flex-col items-center px-1 text-center'>
                <div
                  className={cn(
                    'relative z-10 mb-3 flex size-11 items-center justify-center rounded-full border-2',
                    done && 'border-green-500 bg-green-500 text-white',
                    active &&
                      'border-green-500 bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.45)]',
                    !done && !active && 'border-muted bg-muted text-muted-foreground'
                  )}
                >
                  {done || active ? (
                    <IconCheckbox className='size-5' />
                  ) : (
                    <IconPackage className='size-5' />
                  )}
                </div>
                <Typography.Text weight='medium' className='text-xs leading-snug'>
                  {step.title}
                </Typography.Text>
                {step.occurred_at ? (
                  <Typography.Subtle className='mt-1 text-[10px]'>
                    {formatDate(step.occurred_at, DATE_FORMATS.WITH_TIME)}
                  </Typography.Subtle>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
