'use client';

import {
  IconCheckbox,
  IconClipboardCheck,
  IconHome,
  IconPackage,
  IconPackageExport,
  IconSearch,
  IconTruck,
  IconWallet
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { DATE_FORMATS, formatDate } from '@/lib/date';
import { cn } from '@/lib/utils';

import type { OrderTrackingMilestone } from '../types/order-tracking.types';

const MILESTONE_ICONS: Record<string, typeof IconCheckbox> = {
  order_confirmed: IconCheckbox,
  payment_received: IconWallet,
  warehouse_processing: IconPackage,
  quality_inspection: IconSearch,
  packaged: IconClipboardCheck,
  shipped: IconPackageExport,
  out_for_delivery: IconTruck,
  delivered: IconHome
};

interface OrderTrackingMilestonesProps {
  milestones: OrderTrackingMilestone[];
}

/** Horizontal (desktop) / vertical (mobile) 8-step delivery progress. */
export function OrderTrackingMilestones({ milestones }: OrderTrackingMilestonesProps) {
  const t = useTranslations('orderTracking.page');

  if (milestones.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 }}
      className='mb-10'
      aria-label={t('deliveryProgress')}
    >
      <Typography.H3 className='mb-6 text-lg'>{t('deliveryProgress')}</Typography.H3>

      <div className='relative sm:hidden'>
        <div className='bg-border absolute top-5 bottom-4 left-5 w-0.5' />
        <Flex direction='column' gap={0}>
          {milestones.map((step, index) => {
            const Icon = MILESTONE_ICONS[step.key] ?? IconPackage;
            const done = step.status === 'completed';
            const active = step.status === 'active';

            return (
              <Flex key={step.key} direction='row' gap={4} className='relative pb-6 last:pb-0'>
                <div
                  className={cn(
                    'relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-2',
                    done && 'border-green-500 bg-green-500 text-white',
                    active &&
                      'border-green-500 bg-green-500/15 text-green-600 shadow-[0_0_16px_rgba(34,197,94,0.35)]',
                    !done && !active && 'border-muted bg-muted text-muted-foreground'
                  )}
                >
                  <Icon className='size-4' />
                </div>
                <div className='min-w-0 pt-1'>
                  <Typography.Text weight='medium' className='text-sm'>
                    {step.title}
                  </Typography.Text>
                  {step.occurred_at ? (
                    <Typography.Subtle>
                      {formatDate(step.occurred_at, DATE_FORMATS.WITH_TIME)}
                    </Typography.Subtle>
                  ) : (
                    <Typography.Subtle>{step.description}</Typography.Subtle>
                  )}
                </div>
                <span className='sr-only'>
                  Step {index + 1}: {step.status}
                </span>
              </Flex>
            );
          })}
        </Flex>
      </div>

      <div className='relative hidden overflow-x-auto pb-2 sm:block'>
        <div className='bg-border absolute top-5 right-6 left-6 h-0.5' />
        <div className='relative grid min-w-[720px] grid-cols-8 gap-1'>
          {milestones.map((step) => {
            const Icon = MILESTONE_ICONS[step.key] ?? IconPackage;
            const done = step.status === 'completed';
            const active = step.status === 'active';

            return (
              <div key={step.key} className='flex flex-col items-center px-1 text-center'>
                <div
                  className={cn(
                    'relative z-10 mb-3 flex size-10 items-center justify-center rounded-full border-2',
                    done && 'border-green-500 bg-green-500 text-white',
                    active &&
                      'border-green-500 bg-green-500/15 text-green-600 shadow-[0_0_16px_rgba(34,197,94,0.35)]',
                    !done && !active && 'border-muted bg-muted text-muted-foreground'
                  )}
                >
                  <Icon className='size-4' />
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
