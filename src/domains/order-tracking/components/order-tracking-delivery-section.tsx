'use client';

import {
  IconMapPin,
  IconPackage,
  IconPhone,
  IconShieldCheck,
  IconSignature,
  IconTruck
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { OrderTrackingMap } from '@/components/map/order-tracking-map';
import { Badge } from '@/components/ui/badge';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { GridItem } from '@/components/ui/grid-item';
import { Typography } from '@/components/ui/typography';

import type { OrderTrackingDelivery } from '../types/order-tracking.types';

interface OrderTrackingDeliverySectionProps {
  delivery?: OrderTrackingDelivery;
  estimatedArrival?: string;
}

/** Live map + delivery information card. */
export function OrderTrackingDeliverySection({
  delivery,
  estimatedArrival
}: OrderTrackingDeliverySectionProps) {
  const t = useTranslations('orderTracking.page');

  if (!delivery) return null;

  const hasCoords =
    delivery.destination_lat != null &&
    delivery.destination_lng != null &&
    Number.isFinite(delivery.destination_lat) &&
    Number.isFinite(delivery.destination_lng);

  const addressLines = [
    [delivery.address_line1, delivery.address_line2].filter(Boolean).join(', '),
    [delivery.city, delivery.state, delivery.postal_code].filter(Boolean).join(', '),
    delivery.country
  ].filter(Boolean);

  return (
    <Grid gap={6} className='mb-10 grid-cols-1 lg:grid-cols-5'>
      <GridItem className='lg:col-span-3'>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Typography.H3 className='mb-4 text-lg'>{t('liveTracking')}</Typography.H3>
          {hasCoords ? (
            <OrderTrackingMap
              destination={{
                latitude: delivery.destination_lat!,
                longitude: delivery.destination_lng!,
                label: t('deliveryLocation')
              }}
              hub={
                delivery.hub_lat != null && delivery.hub_lng != null
                  ? {
                      latitude: delivery.hub_lat,
                      longitude: delivery.hub_lng,
                      label: t('distributionCenter')
                    }
                  : null
              }
              distanceMiles={delivery.distance_miles}
              stopsRemaining={delivery.stops_remaining}
              estimatedArrival={estimatedArrival}
            />
          ) : (
            <div className='bg-muted border-border flex h-[280px] items-center justify-center rounded-2xl border sm:h-[320px]'>
              <Typography.Muted>{t('mapUnavailable')}</Typography.Muted>
            </div>
          )}
        </motion.div>
      </GridItem>

      <GridItem className='lg:col-span-2'>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className='bg-card border-border/60 h-full rounded-2xl border p-5'
        >
          <Typography.H3 className='mb-4 text-lg'>{t('deliveryInfo')}</Typography.H3>
          <Flex direction='column' gap={4}>
            <div>
              <Typography.Subtle>{t('recipient')}</Typography.Subtle>
              <Typography.Text weight='medium'>{delivery.recipient_name || '—'}</Typography.Text>
            </div>
            <div>
              <Flex direction='row' align='center' gap={2} className='mb-1'>
                <IconMapPin className='text-accent size-4' />
                <Typography.Subtle>{t('shippingAddress')}</Typography.Subtle>
              </Flex>
              {addressLines.length > 0 ? (
                addressLines.map((line) => (
                  <Typography.Text key={line} className='text-sm leading-snug'>
                    {line}
                  </Typography.Text>
                ))
              ) : (
                <Typography.Muted>—</Typography.Muted>
              )}
            </div>
            {delivery.phone ? (
              <div>
                <Flex direction='row' align='center' gap={2} className='mb-1'>
                  <IconPhone className='text-accent size-4' />
                  <Typography.Subtle>{t('phone')}</Typography.Subtle>
                </Flex>
                <Typography.Text className='text-sm'>{delivery.phone}</Typography.Text>
              </div>
            ) : null}
            {delivery.instructions ? (
              <div>
                <Typography.Subtle>{t('instructions')}</Typography.Subtle>
                <Typography.Text className='text-sm'>{delivery.instructions}</Typography.Text>
              </div>
            ) : null}
            <div>
              <Flex direction='row' align='center' gap={2} className='mb-1'>
                <IconTruck className='text-accent size-4' />
                <Typography.Subtle>{t('method')}</Typography.Subtle>
              </Flex>
              <Typography.Text className='text-sm'>{delivery.service_name || '—'}</Typography.Text>
            </div>
            <div>
              <Flex direction='row' align='center' gap={2} className='mb-1'>
                <IconPackage className='text-accent size-4' />
                <Typography.Subtle>{t('packageDetails')}</Typography.Subtle>
              </Flex>
              <Typography.Text className='text-sm'>
                {[
                  delivery.package_weight_kg != null
                    ? `${delivery.package_weight_kg.toFixed(1)} kg`
                    : null,
                  delivery.package_dimensions
                ]
                  .filter(Boolean)
                  .join(' · ') || '—'}
              </Typography.Text>
            </div>
            <Flex direction='row' gap={2} className='flex-wrap'>
              {delivery.insurance_included ? (
                <Badge variant='outline' className='gap-1 rounded-full'>
                  <IconShieldCheck className='size-3.5' />
                  {t('insurance')}
                </Badge>
              ) : null}
              {delivery.signature_required ? (
                <Badge variant='outline' className='gap-1 rounded-full'>
                  <IconSignature className='size-3.5' />
                  {t('signature')}
                </Badge>
              ) : null}
            </Flex>
          </Flex>
        </motion.div>
      </GridItem>
    </Grid>
  );
}
