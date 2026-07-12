'use client';

import { IconCheck, IconCopy, IconShoppingBag } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { AppImage } from '@/components/ui/app-image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { GridItem } from '@/components/ui/grid-item';
import { Typography } from '@/components/ui/typography';
import { cartMoneyClassName, formatCartMoney } from '@/domains/cart/lib/cart-utils';
import { IMAGE_FALLBACK } from '@/lib/images';
import { cn, copyToClipboard } from '@/lib/utils';

import type { OrderTrackingItem, OrderTrackingPaymentSummary } from '../types/order-tracking.types';

interface OrderTrackingItemsPaymentProps {
  items: OrderTrackingItem[];
  payment?: OrderTrackingPaymentSummary;
  shipmentStatus?: string;
}

/** Ordered items list + payment summary card. */
export function OrderTrackingItemsPayment({
  items,
  payment,
  shipmentStatus
}: OrderTrackingItemsPaymentProps) {
  const t = useTranslations('orderTracking.page');
  const [copied, setCopied] = useState(false);
  const txn = payment?.transaction_id;

  const handleCopyTxn = async () => {
    if (!txn) return;
    await copyToClipboard(txn, 'transaction id');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Grid gap={6} className='mb-10 grid-cols-1 lg:grid-cols-5'>
      <GridItem className='lg:col-span-3'>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-card border-border/60 rounded-2xl border p-5 sm:p-6'
        >
          <Typography.H3 className='mb-4 text-lg'>{t('orderedItems')}</Typography.H3>
          <div className='divide-border/60 divide-y'>
            {items.map((item, index) => (
              <Flex
                key={item.id ?? `${item.productId}-${index}`}
                direction='row'
                align='center'
                gap={4}
                className='py-4 first:pt-0 last:pb-0'
              >
                <div className='bg-muted relative size-16 shrink-0 overflow-hidden rounded-xl'>
                  <AppImage
                    src={item.image ?? IMAGE_FALLBACK}
                    alt={item.name}
                    fill
                    sizes='64px'
                    className='object-cover'
                  />
                </div>
                <Flex direction='column' gap={1} className='min-w-0 flex-1'>
                  <Typography.Text weight='medium' className='truncate'>
                    {item.name}
                  </Typography.Text>
                  {(item.category || item.sku) && (
                    <Typography.Subtle className='truncate'>
                      {[item.category, item.sku].filter(Boolean).join(' · ')}
                    </Typography.Subtle>
                  )}
                  <Flex direction='row' align='center' gap={2} className='flex-wrap'>
                    <Typography.Subtle>
                      {formatCartMoney(item.unitPrice)} · Qty {item.quantity}
                    </Typography.Subtle>
                    {shipmentStatus ? (
                      <Badge variant='secondary' className='rounded-full text-xs capitalize'>
                        {shipmentStatus}
                      </Badge>
                    ) : null}
                  </Flex>
                </Flex>
                <Typography.Text weight='semibold' className={cn('shrink-0', cartMoneyClassName)}>
                  {formatCartMoney(item.totalPrice)}
                </Typography.Text>
              </Flex>
            ))}
          </div>
          <Button asChild variant='outline' className='mt-4 w-full rounded-full sm:w-auto'>
            <Link href='/shop'>
              <IconShoppingBag className='mr-2 size-4' />
              {t('buyAgain')}
            </Link>
          </Button>
        </motion.div>
      </GridItem>

      <GridItem className='lg:col-span-2'>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className='bg-card border-border/60 h-full rounded-2xl border p-5 sm:p-6'
        >
          <Typography.H3 className='mb-4 text-lg'>{t('paymentSummary')}</Typography.H3>
          <Flex direction='column' gap={2} className='text-sm'>
            <Flex direction='row' justify='between'>
              <Typography.Muted>{t('subtotal')}</Typography.Muted>
              <span className={cartMoneyClassName}>{formatCartMoney(payment?.subtotal)}</span>
            </Flex>
            {(payment?.discount ?? 0) > 0 ? (
              <Flex direction='row' justify='between'>
                <Typography.Muted>{t('discount')}</Typography.Muted>
                <span className={cn(cartMoneyClassName, 'text-green-600')}>
                  -{formatCartMoney(payment?.discount)}
                </span>
              </Flex>
            ) : null}
            <Flex direction='row' justify='between'>
              <Typography.Muted>{t('shipping')}</Typography.Muted>
              <span className={cartMoneyClassName}>
                {(payment?.shipping ?? 0) <= 0 ? t('free') : formatCartMoney(payment?.shipping)}
              </span>
            </Flex>
            <Flex direction='row' justify='between'>
              <Typography.Muted>{t('tax')}</Typography.Muted>
              <span className={cartMoneyClassName}>{formatCartMoney(payment?.tax)}</span>
            </Flex>
            <Flex direction='row' justify='between' className='border-border/60 mt-2 border-t pt-3'>
              <Typography.Text weight='semibold'>{t('totalPaid')}</Typography.Text>
              <Typography.Large className={cn('text-accent', cartMoneyClassName)}>
                {formatCartMoney(payment?.total)}
              </Typography.Large>
            </Flex>
          </Flex>

          <div className='border-border/60 mt-4 space-y-2 border-t pt-4 text-sm'>
            <Flex direction='row' justify='between' gap={2}>
              <Typography.Muted>{t('paymentMethod')}</Typography.Muted>
              <Typography.Text className='capitalize'>
                {payment?.method?.replace(/_/g, ' ') || '—'}
                {payment?.card_last4 ? ` ···· ${payment.card_last4}` : ''}
              </Typography.Text>
            </Flex>
            {txn ? (
              <Flex direction='row' align='center' justify='between' gap={2}>
                <Typography.Muted>{t('transactionId')}</Typography.Muted>
                <Flex direction='row' align='center' gap={1} className='min-w-0'>
                  <Typography.Text family='mono' className='truncate text-xs'>
                    {txn}
                  </Typography.Text>
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='size-7 shrink-0 rounded-full'
                    onClick={handleCopyTxn}
                  >
                    {copied ? (
                      <IconCheck className='size-3.5 text-green-500' />
                    ) : (
                      <IconCopy className='size-3.5' />
                    )}
                  </Button>
                </Flex>
              </Flex>
            ) : null}
          </div>
        </motion.div>
      </GridItem>
    </Grid>
  );
}
