'use client';

import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Flex } from '@/components/ui/flex';
import { Separator } from '@/components/ui/separator';
import { Typography } from '@/components/ui/typography';
import { cartMoneyClassName, formatCartMoney } from '@/domains/cart/lib/cart-utils';
import { cn } from '@/lib/utils';

interface OrderTrackingMobileSummaryProps {
  itemCount: number;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  currency: string;
}

/** Collapsible order total on mobile — full breakdown in order-tracking sidebar is desktop-only. */
export function OrderTrackingMobileSummary({
  itemCount,
  subtotal,
  shippingCost,
  tax,
  total,
  currency
}: OrderTrackingMobileSummaryProps) {
  const t = useTranslations('orderTracking.summary');
  const [open, setOpen] = useState(false);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className='bg-card border-border/60 mb-4 rounded-xl border lg:hidden'
    >
      <CollapsibleTrigger asChild>
        <button type='button' className='flex w-full items-center justify-between gap-3 px-4 py-3 text-left'>
          <Flex direction='column' spacing={0.5} className='min-w-0'>
            <Typography.Text variant='small' className='font-medium'>
              {open ? t('hide') : t('show')}
            </Typography.Text>
            <Typography.Text variant='subtle'>
              {t('itemCount', { count: itemCount })}
            </Typography.Text>
          </Flex>
          <Flex direction='row' align='center' spacing={2} className='shrink-0'>
            <Typography.Text variant='large' className={cn(cartMoneyClassName, 'font-semibold')}>
              {formatCartMoney(total)}
            </Typography.Text>
            {open ? (
              <IconChevronUp className='text-muted-foreground h-4 w-4' />
            ) : (
              <IconChevronDown className='text-muted-foreground h-4 w-4' />
            )}
          </Flex>
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className='border-border/60 space-y-3 border-t px-4 py-4'>
        <Flex direction='column' spacing={2} className={cartMoneyClassName}>
          <Flex direction='row' justify='between' align='center'>
            <Typography.Text variant='muted'>{t('subtotal')}</Typography.Text>
            <Typography.Text variant='small'>{formatCartMoney(subtotal)}</Typography.Text>
          </Flex>
          <Flex direction='row' justify='between' align='center'>
            <Typography.Text variant='muted'>{t('shipping')}</Typography.Text>
            <Typography.Text variant='small'>
              {shippingCost === 0 ? t('free') : formatCartMoney(shippingCost)}
            </Typography.Text>
          </Flex>
          {tax > 0 ? (
            <Flex direction='row' justify='between' align='center'>
              <Typography.Text variant='muted'>{t('tax')}</Typography.Text>
              <Typography.Text variant='small'>{formatCartMoney(tax)}</Typography.Text>
            </Flex>
          ) : null}
        </Flex>
        <Separator />
        <Flex direction='row' justify='between' align='center'>
          <Typography.Text variant='small' className='font-semibold'>
            {t('total')}
          </Typography.Text>
          <Typography.Text variant='large' className={cn(cartMoneyClassName, 'font-bold')}>
            {formatCartMoney(total)}
          </Typography.Text>
        </Flex>
        {currency ? (
          <Typography.Text variant='subtle' className='text-right uppercase'>
            {currency}
          </Typography.Text>
        ) : null}
      </CollapsibleContent>
    </Collapsible>
  );
}
