'use client';

import { IconChevronDown, IconExternalLink, IconPackage, IconTruck } from '@tabler/icons-react';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { OrderNumber } from '@/components/order-number';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import type { ModelsOrder } from '~/src/services/-orders-my-get.schemas';

import {
  countOrderItems,
  formatOrderAmount,
  getOrderLineTotal,
  getOrderTrackingHref
} from '../lib/order-utils';
import { OrderStatusBadge } from './order-status-badge';

interface OrderHistoryCardProps {
  order: ModelsOrder;
}

export function OrderHistoryCard({ order }: OrderHistoryCardProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations('account.orders');
  const tCommon = useTranslations('account.common');
  const items = order.items ?? [];
  const itemCount = countOrderItems(items);
  const trackingHref = getOrderTrackingHref(order);
  const previewItems = items.slice(0, 4);
  const hiddenCount = Math.max(items.length - previewItems.length, 0);
  const shipment = order.shipment;
  const placedDate = order.created_at
    ? format(new Date(order.created_at), 'PPP')
    : t('dateUnavailable');

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <article className='bg-card border-border/70 hover:border-border rounded-2xl border shadow-sm transition-[border-color,box-shadow] hover:shadow-md'>
        <div className='p-5 sm:p-6'>
          <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
            <div className='min-w-0 space-y-2'>
              <div className='flex min-w-0 flex-wrap items-center gap-2'>
                <IconPackage className='text-accent size-4 shrink-0' />
                <OrderNumber
                  value={order.order_number ?? `Order #${order.id}`}
                  size='md'
                  className='min-w-0'
                />
              </div>
              <p className='text-muted-foreground text-sm'>{t('placed', { date: placedDate })}</p>
              {shipment?.tracking_number ? (
                <p className='text-muted-foreground flex items-start gap-1.5 text-xs'>
                  <IconTruck className='mt-0.5 size-3.5 shrink-0' />
                  <span>
                    {t('tracking')}{' '}
                    <span className='font-mono tracking-normal break-all tabular-nums'>
                      {shipment.tracking_number}
                    </span>
                  </span>
                </p>
              ) : null}
            </div>

            <div className='flex flex-wrap items-center gap-2 sm:justify-end'>
              <OrderStatusBadge status={order.status} />
              {trackingHref ? (
                <Button asChild variant='outline' size='sm'>
                  <Link href={trackingHref}>
                    {t('trackOrder')}
                    <IconExternalLink className='size-3.5' />
                  </Link>
                </Button>
              ) : null}
            </div>
          </div>

          {items.length > 0 ? (
            <div className='mt-5 flex items-center gap-3'>
              <div className='flex -space-x-2'>
                {previewItems.map((item, index) => {
                  const imageUrl = item.product?.images?.[0];
                  const productName = item.product?.name ?? tCommon('product');

                  return (
                    <div
                      key={item.id ?? `${order.id}-preview-${index}`}
                      className='bg-muted border-background relative size-12 overflow-hidden rounded-xl border-2 sm:size-14'
                    >
                      {imageUrl ? (
                        <Image src={imageUrl} alt={productName} fill className='object-cover' />
                      ) : (
                        <div className='text-muted-foreground flex h-full w-full items-center justify-center'>
                          <IconPackage className='size-4' />
                        </div>
                      )}
                    </div>
                  );
                })}
                {hiddenCount > 0 ? (
                  <div className='bg-muted border-background text-muted-foreground flex size-12 items-center justify-center rounded-xl border-2 text-xs font-medium sm:size-14'>
                    +{hiddenCount}
                  </div>
                ) : null}
              </div>
              <p className='text-muted-foreground text-sm'>
                {itemCount}{' '}
                {itemCount === 1 ? tCommon('item') : tCommon('items')}
              </p>
            </div>
          ) : null}

          <div className='border-border mt-5 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <p className='text-muted-foreground text-xs tracking-wide uppercase'>
                {t('orderTotal')}
              </p>
              <p className='text-xl font-semibold tabular-nums'>
                {formatOrderAmount(order.total_amount)}
              </p>
            </div>

            {items.length > 0 ? (
              <CollapsibleTrigger asChild>
                <Button variant='ghost' size='sm' className='self-start sm:self-auto'>
                  {open ? t('hideDetails') : t('viewDetails')}
                  <IconChevronDown
                    className={cn('size-4 transition-transform', open && 'rotate-180')}
                  />
                </Button>
              </CollapsibleTrigger>
            ) : null}
          </div>
        </div>

        <CollapsibleContent>
          <div className='border-border border-t px-5 pb-5 sm:px-6 sm:pb-6'>
            <div className='divide-border divide-y'>
              {items.map((item, index) => {
                const productName = item.product?.name ?? tCommon('product');
                const imageUrl = item.product?.images?.[0];

                return (
                  <div
                    key={item.id ?? `${order.id}-item-${index}`}
                    className='flex gap-3 py-4 first:pt-4 last:pb-0 sm:gap-4'
                  >
                    <div className='bg-muted relative size-16 shrink-0 overflow-hidden rounded-xl sm:size-20'>
                      {imageUrl ? (
                        <Image src={imageUrl} alt={productName} fill className='object-cover' />
                      ) : (
                        <div className='text-muted-foreground flex h-full w-full items-center justify-center'>
                          <IconPackage className='size-5' />
                        </div>
                      )}
                    </div>
                    <div className='flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-start sm:justify-between'>
                      <div className='min-w-0'>
                        <p className='truncate font-medium'>{productName}</p>
                        <p className='text-muted-foreground text-sm'>
                          {t('qtyEach', {
                            qty: item.quantity ?? 0,
                            price: formatOrderAmount(item.price)
                          })}
                        </p>
                      </div>
                      <p className='font-medium tabular-nums'>
                        {formatOrderAmount(getOrderLineTotal(item))}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CollapsibleContent>
      </article>
    </Collapsible>
  );
}
