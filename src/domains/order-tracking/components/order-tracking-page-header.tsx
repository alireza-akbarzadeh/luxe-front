'use client';

import { IconCheck, IconCopy, IconFileInvoice, IconPackage, IconTruck } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { OrderNumber } from '@/components/order-number';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { GridItem } from '@/components/ui/grid-item';
import { Typography } from '@/components/ui/typography';
import { DATE_FORMATS, formatDate } from '@/lib/date';
import { cn, copyToClipboard } from '@/lib/utils';

import type { OrderTrackingCourier } from '../types/order-tracking.types';
import { OrderTrackingLiveBadge } from './order-tracking-live-badge';

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';

interface OrderTrackingPageHeaderProps {
  orderId: number;
  orderNumber: string;
  createdAt?: string;
  statusLabel: string;
  estimatedArrival?: string;
  progressPercent: number;
  courier?: OrderTrackingCourier;
  connectionStatus: ConnectionStatus;
}

/** Page chrome: breadcrumbs, title, status hero, courier panel. */
export function OrderTrackingPageHeader({
  orderId,
  orderNumber,
  createdAt,
  statusLabel,
  estimatedArrival,
  progressPercent,
  courier,
  connectionStatus
}: OrderTrackingPageHeaderProps) {
  const t = useTranslations('orderTracking.page');
  const [copiedOrder, setCopiedOrder] = useState(false);
  const [copiedTracking, setCopiedTracking] = useState(false);
  const trackingNumber = courier?.tracking_number ?? '';

  const handleCopyOrder = async () => {
    await copyToClipboard(orderNumber, 'order number');
    setCopiedOrder(true);
    setTimeout(() => setCopiedOrder(false), 2000);
  };

  const handleCopyTracking = async () => {
    if (!trackingNumber) return;
    await copyToClipboard(trackingNumber, 'tracking number');
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  return (
    <Flex direction='column' gap={5} className='mb-8 sm:mb-10'>
      <Flex direction='row' align='center' justify='between' className='flex-wrap gap-3'>
        <nav aria-label='Breadcrumb' className='text-muted-foreground hidden text-sm sm:block'>
          <Link href='/' className='hover:text-foreground'>
            {t('breadcrumbHome')}
          </Link>
          <span className='mx-2'>/</span>
          <Link href='/account' className='hover:text-foreground'>
            {t('breadcrumbOrders')}
          </Link>
          <span className='mx-2'>/</span>
          <span className='text-foreground'>
            {t('breadcrumbOrder')} <OrderNumber value={orderNumber} size='sm' className='inline' />
          </span>
        </nav>
        <OrderTrackingLiveBadge connectionStatus={connectionStatus} />
      </Flex>

      <Flex direction='row' align='start' justify='between' gap={4} className='flex-wrap'>
        <div>
          <Typography.H1 className='mb-1 text-2xl sm:mb-2 sm:text-3xl md:text-4xl'>
            {t('title')}
          </Typography.H1>
          <Typography.Muted className='text-accent text-sm sm:text-base'>
            {t('subtitle')}
          </Typography.Muted>
          {createdAt ? (
            <Typography.Subtle className='mt-2 hidden sm:block'>
              {t('placedOn', { date: formatDate(createdAt, DATE_FORMATS.WITH_TIME) })}
            </Typography.Subtle>
          ) : null}
        </div>
        <Button asChild variant='outline' className='hidden rounded-full sm:inline-flex'>
          <Link href={`/order-confirmed/${orderId}`}>
            <IconFileInvoice className='mr-2 size-4' />
            {t('viewInvoice')}
          </Link>
        </Button>
      </Flex>

      {/* Mobile status card — matches design overview */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className='bg-card border-border/60 rounded-2xl border p-4 sm:hidden'
      >
        <Flex direction='row' align='center' justify='between' gap={2} className='mb-3'>
          <Flex direction='row' align='center' gap={2} className='min-w-0'>
            <Typography.Subtle>{t('orderLabel')}</Typography.Subtle>
            <OrderNumber value={orderNumber} size='sm' />
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='size-7 shrink-0 rounded-full'
              onClick={handleCopyOrder}
              aria-label={t('copyOrder')}
            >
              {copiedOrder ? (
                <IconCheck className='size-3.5 text-green-500' />
              ) : (
                <IconCopy className='size-3.5' />
              )}
            </Button>
          </Flex>
        </Flex>

        <Typography.Subtle className='mb-1'>{t('currentStatus')}</Typography.Subtle>
        <Badge className='mb-3 rounded-full bg-green-500/15 px-3 py-1 text-green-500'>
          {statusLabel}
        </Badge>

        {estimatedArrival ? (
          <>
            <Typography.Subtle>{t('estimatedDelivery')}</Typography.Subtle>
            <Typography.Text weight='semibold' className='mb-3 text-sm'>
              {estimatedArrival}
            </Typography.Text>
          </>
        ) : null}

        <div className='bg-muted mb-2 h-2 overflow-hidden rounded-full'>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            className='h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400'
          />
        </div>
        <Typography.Subtle className='mb-4'>
          {t('percentComplete', { percent: progressPercent })}
        </Typography.Subtle>

        <div className='border-border/60 space-y-2 border-t pt-3'>
          <Flex direction='row' align='center' gap={2}>
            <IconTruck className='text-accent size-4' />
            <Typography.Text weight='medium' className='text-sm'>
              {courier?.name ?? '—'}
            </Typography.Text>
          </Flex>
          {trackingNumber ? (
            <Flex direction='row' align='center' gap={2}>
              <Typography.Subtle>{t('trackingNumber')}</Typography.Subtle>
              <Typography.Text family='mono' className='text-xs'>
                {trackingNumber}
              </Typography.Text>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='size-7 rounded-full'
                onClick={handleCopyTracking}
                aria-label={t('copyTracking')}
              >
                {copiedTracking ? (
                  <IconCheck className='size-3.5 text-green-500' />
                ) : (
                  <IconCopy className='size-3.5' />
                )}
              </Button>
            </Flex>
          ) : null}
          <Typography.Subtle>
            {courier?.service ?? '—'} · {t('totalItems', { count: courier?.total_items ?? 0 })}
          </Typography.Subtle>
        </div>
      </motion.div>

      {/* Desktop hero cards */}
      <Grid gap={4} className='hidden grid-cols-1 sm:grid lg:grid-cols-3'>
        <GridItem>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className='bg-card border-border/60 h-full rounded-2xl border p-5'
          >
            <Typography.Overline className='mb-2'>{t('currentStatus')}</Typography.Overline>
            <Badge className='mb-4 rounded-full bg-green-500/15 px-3 py-1 text-green-600'>
              {statusLabel}
            </Badge>
            {estimatedArrival ? (
              <>
                <Typography.Subtle>{t('estimatedDelivery')}</Typography.Subtle>
                <Typography.Text weight='semibold' className='mb-4 text-sm'>
                  {estimatedArrival}
                </Typography.Text>
              </>
            ) : null}
            <div className='bg-muted h-2 overflow-hidden rounded-full'>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                className='h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400'
              />
            </div>
            <Typography.Subtle className='mt-2'>
              {t('percentComplete', { percent: progressPercent })}
            </Typography.Subtle>
          </motion.div>
        </GridItem>

        <GridItem>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className='from-accent/10 via-card to-card border-border/60 flex h-full items-center justify-center rounded-2xl border bg-gradient-to-br p-6'
          >
            <div className='text-center'>
              <div className='border-accent/30 bg-accent/10 mx-auto mb-3 flex size-20 items-center justify-center rounded-full border'>
                <IconTruck className='text-accent size-10' />
              </div>
              <Typography.Text weight='semibold'>{t('onTheWay')}</Typography.Text>
              <Typography.Subtle>{t('onTheWayHint')}</Typography.Subtle>
            </div>
          </motion.div>
        </GridItem>

        <GridItem>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className='bg-card border-border/60 h-full rounded-2xl border p-5'
          >
            <Typography.Overline className='mb-3'>{t('courier')}</Typography.Overline>
            <Typography.Text weight='semibold' className='mb-3'>
              {courier?.name ?? '—'}
            </Typography.Text>
            {trackingNumber ? (
              <Flex direction='row' align='center' gap={2} className='mb-3'>
                <Typography.Subtle>{t('trackingNumber')}</Typography.Subtle>
                <Typography.Text family='mono' className='text-sm'>
                  {trackingNumber}
                </Typography.Text>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='size-7 rounded-full'
                  onClick={handleCopyTracking}
                  aria-label={t('copyTracking')}
                >
                  {copiedTracking ? (
                    <IconCheck className='size-3.5 text-green-500' />
                  ) : (
                    <IconCopy className='size-3.5' />
                  )}
                </Button>
              </Flex>
            ) : null}
            <Typography.Subtle className='mb-1'>{t('service')}</Typography.Subtle>
            <Typography.Text className='mb-3 text-sm'>{courier?.service ?? '—'}</Typography.Text>
            <Flex direction='row' align='center' gap={2}>
              <IconPackage className={cn('text-accent size-4')} />
              <Typography.Text className='text-sm'>
                {t('totalItems', { count: courier?.total_items ?? 0 })}
              </Typography.Text>
            </Flex>
          </motion.div>
        </GridItem>
      </Grid>
    </Flex>
  );
}
