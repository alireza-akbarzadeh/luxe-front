'use client';

import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Flex } from '@/components/ui/flex';
import { Separator } from '@/components/ui/separator';
import { Typography } from '@/components/ui/typography';
import { formatEstimatedTaxLabel } from '@/domains/cart/lib/cart-commerce-settings';
import { cartMoneyClassName, formatCartMoney } from '@/domains/cart/lib/cart-utils';
import { useCartController } from '@/hooks/useCartController';
import { cn } from '@/lib/utils';

import { useCartOrderEstimate } from '../hooks/use-cart-order-estimate';
import { FreeShippingProgress } from './free-shipping-progress';

/** Collapsible order breakdown at top of cart on mobile. */
export function CartMobileSummary() {
  const t = useTranslations('cart.page');
  const [open, setOpen] = useState(false);
  const { subtotal, items, itemCount } = useCartController();
  const { totalDiscount, shipping, tax, total, settings } = useCartOrderEstimate(items, subtotal);

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
              {open ? t('hideSummary') : t('showSummary')}
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
        <FreeShippingProgress subtotal={subtotal} />
        <Flex direction='column' spacing={2}>
          <Flex direction='row' justify='between' align='center'>
            <Typography.Text variant='muted'>{t('subtotal')}</Typography.Text>
            <Typography.Text variant='small' className={cartMoneyClassName}>
              {formatCartMoney(subtotal)}
            </Typography.Text>
          </Flex>
          {totalDiscount > 0 ? (
            <Flex direction='row' justify='between' align='center'>
              <Typography.Text variant='small' tone='success'>
                {t('savings')}
              </Typography.Text>
              <Typography.Text variant='small' tone='success' className={cartMoneyClassName}>
                −{formatCartMoney(totalDiscount)}
              </Typography.Text>
            </Flex>
          ) : null}
          <Flex direction='row' justify='between' align='center'>
            <Typography.Text variant='muted'>{t('shipping')}</Typography.Text>
            <Typography.Text variant='small' className={cartMoneyClassName}>
              {shipping === 0 ? (
                <Typography.Text variant='small' tone='success'>
                  {t('freeShipping')}
                </Typography.Text>
              ) : (
                formatCartMoney(shipping)
              )}
            </Typography.Text>
          </Flex>
          {settings.estimatedTaxEnabled && tax > 0 ? (
            <Flex direction='row' justify='between' align='center'>
              <Typography.Text variant='muted'>
                {t('estimatedTax', { rate: formatEstimatedTaxLabel(settings.estimatedTaxRate) })}
              </Typography.Text>
              <Typography.Text variant='small' className={cartMoneyClassName}>
                {formatCartMoney(tax)}
              </Typography.Text>
            </Flex>
          ) : null}
        </Flex>
        <Separator />
        <Flex direction='row' justify='between' align='center'>
          <Typography.Text variant='small' className='font-semibold'>
            {t('estimatedTotal')}
          </Typography.Text>
          <Typography.Text variant='large' className={cn(cartMoneyClassName, 'font-bold')}>
            {formatCartMoney(total)}
          </Typography.Text>
        </Flex>
        <Typography.Text variant='subtle'>{t('taxNote')}</Typography.Text>
      </CollapsibleContent>
    </Collapsible>
  );
}
