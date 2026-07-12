'use client';

import { IconCheck, IconCopy, IconCreditCard, IconMapPin, IconTruck } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { useState } from 'react';

import { OrderNumber } from '@/components/order-number';
import { AppImage } from '@/components/ui/app-image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { GridItem } from '@/components/ui/grid-item';
import { Typography } from '@/components/ui/typography';
import { cartMoneyClassName, formatCartMoney } from '@/domains/cart/lib/cart-utils';
import { DATE_FORMATS, formatDate } from '@/lib/date';
import { IMAGE_FALLBACK } from '@/lib/images';
import { cn, copyToClipboard } from '@/lib/utils';

import type { OrderConfirmedView } from '../lib/order-confirmed-mapper';
import {
  formatDeliveryEstimate,
  formatShippingAddressFromView,
  resolvePaymentMethodDisplay
} from '../lib/order-confirmed-utils';
import { OrderConfirmedPaymentIcon } from './order-confirmed-payment-icon';

interface OrderConfirmedOrderCardProps {
  order: OrderConfirmedView;
  paymentComplete: boolean;
}

function InfoColumn({
  icon: Icon,
  label,
  children
}: {
  icon: typeof IconTruck;
  label: string;
  children: ReactNode;
}) {
  return (
    <Flex direction='column' gap={2} className='min-w-0'>
      <Flex direction='row' align='center' gap={2}>
        <Icon className='text-accent size-4 shrink-0' aria-hidden />
        <Typography.Overline>{label}</Typography.Overline>
      </Flex>
      {children}
    </Flex>
  );
}

/** Order summary card — line items plus delivery, shipping, and payment columns. */
export function OrderConfirmedOrderCard({ order, paymentComplete }: OrderConfirmedOrderCardProps) {
  const t = useTranslations('orderConfirmed.card');
  const [copied, setCopied] = useState(false);

  const orderNumber = order.orderNumber;
  const items = order.items;
  const delivery = formatDeliveryEstimate(order.estimatedDelivery, order.createdAt);
  const shipping = formatShippingAddressFromView(order.shipping);
  const payment = resolvePaymentMethodDisplay(order.paymentMethod);

  const handleCopy = async () => {
    if (!orderNumber) return;
    await copyToClipboard(orderNumber, 'order number');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className='bg-card border-border/60 mb-8 overflow-hidden rounded-2xl border shadow-sm'
    >
      <Flex
        direction='column'
        gap={4}
        className='border-border/60 border-b p-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:p-6'
      >
        <Flex direction='column' gap={1} className='min-w-0 text-left'>
          <Typography.Muted className='text-xs'>{t('orderLabel')}</Typography.Muted>
          <Flex direction='row' align='center' gap={2} className='min-w-0'>
            <OrderNumber value={orderNumber} size='lg' />
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='size-8 shrink-0 rounded-full'
              onClick={handleCopy}
              aria-label={t('copyOrder')}
            >
              {copied ? (
                <IconCheck className='size-4 text-green-500' />
              ) : (
                <IconCopy className='size-4' />
              )}
            </Button>
          </Flex>
          {order.createdAt ? (
            <Typography.Subtle>
              {t('placedOn', { date: formatDate(order.createdAt, DATE_FORMATS.WITH_TIME) })}
            </Typography.Subtle>
          ) : null}
        </Flex>

        <Badge
          variant='outline'
          className={cn(
            'w-fit shrink-0 gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium',
            paymentComplete
              ? 'border-green-500/30 bg-green-500/10 text-green-600'
              : 'border-amber-500/30 bg-amber-500/10 text-amber-600'
          )}
        >
          {paymentComplete ? (
            <IconCheck className='size-3.5' aria-hidden />
          ) : (
            <IconCreditCard className='size-3.5' aria-hidden />
          )}
          {paymentComplete ? t('paymentSuccessful') : t('paymentPending')}
        </Badge>
      </Flex>

      {items.length > 0 ? (
        <div className='border-border/60 divide-border/60 divide-y border-b'>
          {items.map((item, index) => (
            <Flex
              key={item.id ?? `${item.sku}-${index}`}
              direction='row'
              align='center'
              gap={4}
              className='p-5 sm:p-6'
            >
              <div className='bg-muted relative size-16 shrink-0 overflow-hidden rounded-xl sm:size-20'>
                <AppImage
                  src={item.image ?? IMAGE_FALLBACK}
                  alt={item.name ?? 'Product'}
                  fill
                  sizes='80px'
                  className='object-cover'
                />
              </div>
              <Flex direction='column' gap={1} className='min-w-0 flex-1'>
                <Typography.Text weight='medium' className='truncate'>
                  {item.name ?? 'Product'}
                </Typography.Text>
                {item.sku || item.category ? (
                  <Typography.Subtle className='truncate'>
                    {[item.category, item.sku].filter(Boolean).join(' · ')}
                  </Typography.Subtle>
                ) : null}
                <Badge variant='secondary' className='w-fit rounded-full px-2 py-0 text-xs'>
                  {t('qty', { count: item.quantity ?? 1 })}
                </Badge>
              </Flex>
              <Typography.Text
                weight='semibold'
                className={cn('shrink-0 tabular-nums', cartMoneyClassName)}
              >
                {formatCartMoney(item.totalPrice ?? 0)}
              </Typography.Text>
            </Flex>
          ))}
        </div>
      ) : null}

      <Grid gap={6} className='grid-cols-1 p-5 sm:grid-cols-3 sm:p-6'>
        <GridItem>
          <InfoColumn icon={IconTruck} label={t('estimatedDelivery')}>
            {delivery ? (
              <>
                <Typography.Text weight='medium' className='text-sm'>
                  {delivery.range}
                </Typography.Text>
                <Typography.Subtle>
                  {delivery.useFallbackWindow ? t('deliveryWindow') : t('deliveryScheduled')}
                </Typography.Subtle>
              </>
            ) : (
              <Typography.Subtle>{t('deliveryUnavailable')}</Typography.Subtle>
            )}
          </InfoColumn>
        </GridItem>

        <GridItem className='sm:border-border/60 sm:border-x sm:px-6'>
          <InfoColumn icon={IconMapPin} label={t('shippingTo')}>
            {shipping ? (
              <>
                {shipping.name ? (
                  <Typography.Text weight='medium' className='text-sm'>
                    {shipping.name}
                  </Typography.Text>
                ) : null}
                {shipping.lines.map((line) => (
                  <Typography.Subtle key={line} className='leading-snug'>
                    {line}
                  </Typography.Subtle>
                ))}
              </>
            ) : (
              <Typography.Subtle>{t('shippingUnavailable')}</Typography.Subtle>
            )}
          </InfoColumn>
        </GridItem>

        <GridItem>
          <InfoColumn icon={IconCreditCard} label={t('paymentMethod')}>
            <Flex direction='row' align='center' gap={2}>
              <OrderConfirmedPaymentIcon brand={payment.brand} />
              <Typography.Text weight='medium' className='text-sm capitalize'>
                {payment.label}
              </Typography.Text>
            </Flex>
          </InfoColumn>
        </GridItem>
      </Grid>

      <Flex
        direction='row'
        align='center'
        justify='between'
        className='border-border/60 bg-muted/20 border-t px-5 py-4 sm:px-6'
      >
        <Typography.Muted>{paymentComplete ? t('totalPaid') : t('orderTotal')}</Typography.Muted>
        <Typography.Large className={cn('tabular-nums', cartMoneyClassName)}>
          {formatCartMoney(order.totalAmount ?? 0)}
        </Typography.Large>
      </Flex>
    </motion.div>
  );
}
