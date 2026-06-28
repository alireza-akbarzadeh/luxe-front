'use client';

import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { useStore } from '@tanstack/react-form';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { withForm } from '@/components/forms/useAppForm';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { cartMoneyClassName, formatCartMoney } from '@/domains/cart/lib/cart-utils';
import { useCartController } from '@/hooks/useCartController';
import { cn } from '@/lib/utils';

import { checkoutDefaultValues } from '../checkout.schema';
import { useCheckoutTotals } from '../hooks/useCartTotal';
import { CheckoutSummaryCoupons } from './checkout-summary-coupons';

/** Collapsible order summary — sticky at top on mobile for express checkout. */
export const CheckoutMobileSummary = withForm({
  defaultValues: checkoutDefaultValues,
  render: function MobileSummaryRender({ form }) {
    const t = useTranslations('checkout.mobileSummary');
    const [open, setOpen] = useState(false);
    const { items } = useCartController();
    const shippingProviderId = useStore(form.store, (s) => s.values.shippingProviderId);
    const { total } = useCheckoutTotals(shippingProviderId);
    const itemCount = items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);

    return (
      <Collapsible
        open={open}
        onOpenChange={setOpen}
        className='bg-card border-border/60 mb-4 rounded-xl border lg:hidden'
      >
        <CollapsibleTrigger asChild>
          <button
            type='button'
            className='flex w-full items-center justify-between gap-3 px-4 py-3 text-left'
          >
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
        <CollapsibleContent className='border-border/60 space-y-4 border-t px-4 py-4'>
          <CheckoutSummaryCoupons form={form} />
          <Flex direction='row' justify='between' align='center'>
            <Typography.Text variant='muted'>{t('totalLabel')}</Typography.Text>
            <Typography.Text variant='small' className={cn(cartMoneyClassName, 'font-semibold')}>
              {formatCartMoney(total)}
            </Typography.Text>
          </Flex>
        </CollapsibleContent>
      </Collapsible>
    );
  }
});
