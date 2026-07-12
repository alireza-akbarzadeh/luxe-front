'use client';

import {
  IconHeadset,
  IconMail,
  IconMessageCircle,
  IconPhone,
  IconStar,
  IconTicket
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { GridItem } from '@/components/ui/grid-item';
import { Typography } from '@/components/ui/typography';
import { DATE_FORMATS, formatDate } from '@/lib/date';

import type { OrderTrackingActivity } from '../lib/order-tracking-utils';
import type { OrderTrackingDriver, OrderTrackingEvent } from '../types/order-tracking.types';

interface OrderTrackingActivitySupportProps {
  events: OrderTrackingEvent[];
  liveActivities: OrderTrackingActivity[];
  driver?: OrderTrackingDriver;
}

/** Activity feed, optional driver card, and support shortcuts. */
export function OrderTrackingActivitySupport({
  events,
  liveActivities,
  driver
}: OrderTrackingActivitySupportProps) {
  const t = useTranslations('orderTracking.page');

  const merged = [
    ...liveActivities.map((a) => ({
      id: a.id,
      title: a.title,
      message: a.message,
      timestamp: new Date(a.timestamp).toISOString()
    })),
    ...events.map((e) => ({
      id: e.id,
      title: e.title,
      message: e.message ?? '',
      timestamp: e.timestamp
    }))
  ].slice(0, 10);

  return (
    <Grid gap={6} className='mb-10 grid-cols-1 lg:grid-cols-5'>
      <GridItem className='lg:col-span-3'>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-card border-border/60 rounded-2xl border p-5 sm:p-6'
        >
          <Typography.H3 className='mb-4 text-lg'>{t('orderActivity')}</Typography.H3>
          {merged.length === 0 ? (
            <Typography.Muted>{t('noActivity')}</Typography.Muted>
          ) : (
            <ol className='relative space-y-5 border-l pl-5'>
              {merged.map((entry) => (
                <li key={entry.id} className='relative'>
                  <span className='bg-accent absolute top-1.5 -left-[1.4rem] size-2.5 rounded-full' />
                  <Typography.Text weight='medium' className='text-sm'>
                    {entry.title}
                  </Typography.Text>
                  {entry.message ? (
                    <Typography.Subtle className='mt-0.5'>{entry.message}</Typography.Subtle>
                  ) : null}
                  <Typography.Subtle className='mt-1'>
                    {formatDate(entry.timestamp, DATE_FORMATS.WITH_TIME)}
                  </Typography.Subtle>
                </li>
              ))}
            </ol>
          )}
        </motion.div>
      </GridItem>

      <GridItem className='lg:col-span-2'>
        <Flex direction='column' gap={4}>
          {driver ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className='bg-card border-border/60 rounded-2xl border p-5'
            >
              <Typography.H3 className='mb-4 text-lg'>{t('deliveryDriver')}</Typography.H3>
              <Flex direction='row' align='center' gap={3} className='mb-3'>
                <div className='bg-accent/15 text-accent flex size-12 items-center justify-center rounded-full text-lg font-semibold'>
                  {driver.name?.charAt(0) ?? 'D'}
                </div>
                <div>
                  <Typography.Text weight='semibold'>{driver.name}</Typography.Text>
                  {driver.rating != null ? (
                    <Flex direction='row' align='center' gap={1}>
                      <IconStar className='size-3.5 fill-amber-400 text-amber-400' />
                      <Typography.Subtle>{driver.rating.toFixed(1)}</Typography.Subtle>
                    </Flex>
                  ) : null}
                </div>
              </Flex>
              <Typography.Subtle className='mb-1'>{driver.carrier}</Typography.Subtle>
              <Typography.Text className='mb-1 text-sm'>{driver.vehicle}</Typography.Text>
              {driver.license_plate ? (
                <Typography.Subtle className='mb-3'>{driver.license_plate}</Typography.Subtle>
              ) : null}
              {driver.estimated_arrival ? (
                <Typography.Text className='mb-4 text-sm'>
                  {t('eta')}: {driver.estimated_arrival}
                </Typography.Text>
              ) : null}
              <Flex direction='row' gap={2}>
                <Button variant='outline' size='sm' className='flex-1 rounded-full' asChild>
                  <Link href='/contact'>
                    <IconPhone className='mr-1.5 size-4' />
                    {t('callDriver')}
                  </Link>
                </Button>
                <Button variant='outline' size='sm' className='flex-1 rounded-full' asChild>
                  <Link href='/contact'>
                    <IconMessageCircle className='mr-1.5 size-4' />
                    {t('messageDriver')}
                  </Link>
                </Button>
              </Flex>
            </motion.div>
          ) : null}

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
            className='bg-card border-border/60 rounded-2xl border p-5'
          >
            <Typography.H3 className='mb-4 text-lg'>{t('needHelp')}</Typography.H3>
            <Grid gap={2} className='grid-cols-2'>
              {[
                { href: '/contact', icon: IconMessageCircle, label: t('liveChat') },
                { href: '/contact', icon: IconMail, label: t('emailSupport') },
                { href: '/contact', icon: IconHeadset, label: t('callSupport') },
                { href: '/contact', icon: IconTicket, label: t('openTicket') }
              ].map(({ href, icon: Icon, label }) => (
                <Button
                  key={label}
                  asChild
                  variant='outline'
                  className='h-auto flex-col gap-2 rounded-xl py-3'
                >
                  <Link href={href}>
                    <Icon className='text-accent size-5' />
                    <span className='text-xs'>{label}</span>
                  </Link>
                </Button>
              ))}
            </Grid>
          </motion.div>
        </Flex>
      </GridItem>
    </Grid>
  );
}
