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
import { cn, copyToClipboard } from '@/lib/utils';

import type { OrderTrackingCourier } from '../types/order-tracking.types';
import { OrderTrackingLiveBadge } from './order-tracking-live-badge';

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';

interface OrderTrackingPageHeaderProps {
  orderId: number;
  orderNumber: string;
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
  statusLabel,
  estimatedArrival,
  progressPercent,
  courier,
  connectionStatus
}: OrderTrackingPageHeaderProps) {
  const t = useTranslations('orderTracking.page');
  const [copied, setCopied] = useState(false);
  const trackingNumber = courier?.tracking_number ?? '';

  const handleCopy = async () => {
    if (!trackingNumber) return;
    await copyToClipboard(trackingNumber, 'tracking number');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Flex direction='column' gap={6} className='mb-10'>
      <Flex direction='row' align='center' justify='between' className='flex-wrap gap-3'>
        <nav aria-label='Breadcrumb' className='text-muted-foreground text-sm'>
          <Link href='/' className='hover:text-foreground'>
            {t('breadcrumbHome')}
          </Link>
          <span className='mx-2'>/</span>
          <Link href='/account/orders' className='hover:text-foreground'>
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
          <Typography.H1 className='mb-2 text-3xl md:text-4xl'>{t('title')}</Typography.H1>
          <Typography.Muted>{t('subtitle')}</Typography.Muted>
        </div>
        <Button asChild variant='outline' className='rounded-full'>
          <Link href={`/order-confirmed/${orderId}`}>
            <IconFileInvoice className='mr-2 size-4' />
            {t('viewInvoice')}
          </Link>
        </Button>
      </Flex>

      <Grid gap={4} className='grid-cols-1 lg:grid-cols-3'>
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
            <Typography.Subtle className='mt-2'>{progressPercent}% complete</Typography.Subtle>
          </motion.div>
        </GridItem>

        <GridItem className='hidden lg:block'>
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
                  onClick={handleCopy}
                  aria-label={t('copyTracking')}
                >
                  {copied ? (
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
