'use client';

import { IconChevronUp } from '@tabler/icons-react';
import { useStore } from '@tanstack/react-form';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { withForm } from '@/components/forms/useAppForm';
import { AppImage } from '@/components/ui/app-image';
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Flex } from '@/components/ui/flex';
import { Separator } from '@/components/ui/separator';
import { Typography } from '@/components/ui/typography';
import { FreeShippingProgress } from '@/domains/cart/components/free-shipping-progress';
import { formatEstimatedTaxLabel } from '@/domains/cart/lib/cart-commerce-settings';
import {
  cartMoneyClassName,
  formatCartMoney,
  getCartItemImage,
  getCartItemName
} from '@/domains/cart/lib/cart-utils';
import { useCartController } from '@/hooks/useCartController';
import { cn } from '@/lib/utils';

import { checkoutDefaultValues } from '../checkout.schema';
import { useCheckoutTotals } from '../hooks/useCartTotal';
import { CheckoutSummaryCoupons } from './checkout-summary-coupons';

/** Tap or drag up on mobile to reveal full order breakdown. */
export const CheckoutMobileSummary = withForm({
  defaultValues: checkoutDefaultValues,
  render: function MobileSummaryRender({ form }) {
    const t = useTranslations('checkout.mobileSummary');
    const tSummary = useTranslations('checkout.summary');
    const [open, setOpen] = useState(false);
    const { items } = useCartController();
    const shippingProviderId = useStore(form.store, (s) => s.values.shippingProviderId);
    const {
      subtotal,
      shippingPrice,
      providerRate,
      hasFreeShipping,
      tax,
      couponDiscount,
      appliedCouponCode,
      total,
      settings
    } = useCheckoutTotals(shippingProviderId);
    const itemCount = items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);

    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <button
            type='button'
            className='bg-muted/40 border-border/60 mb-4 flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-left lg:hidden'
          >
            <Flex direction='column' gap={0.5} className='min-w-0'>
              <Typography.Small weight='medium'>{t('showSummary')}</Typography.Small>
              <Typography.Muted className='text-xs'>
                {t('itemCount', { count: itemCount })}
              </Typography.Muted>
            </Flex>
            <Flex align='center' gap={2} className='shrink-0'>
              <Typography.Text weight='semibold' className={cn(cartMoneyClassName, 'text-base')}>
                {formatCartMoney(total)}
              </Typography.Text>
              <IconChevronUp className='text-muted-foreground size-4' />
            </Flex>
          </button>
        </DrawerTrigger>

        <DrawerContent variant='ios' radius='full' showHandle className='max-h-[min(88dvh,720px)]'>
          <DrawerTitle className='px-4 pt-1 text-center text-base font-semibold'>
            {tSummary('title')}
          </DrawerTitle>

          <div className='max-h-[min(72dvh,640px)] overflow-y-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom))]'>
            <FreeShippingProgress subtotal={subtotal} className='mt-3' />

            <ul className='mt-4 space-y-3'>
              {items.map((item) => (
                <li
                  key={`${item.id}-${item.selected_color}-${item.selected_size}`}
                  className='flex items-center gap-3'
                >
                  <div className='bg-muted relative size-14 shrink-0 overflow-hidden rounded-xl'>
                    <AppImage
                      src={getCartItemImage(item)}
                      alt=''
                      aria-hidden
                      fill
                      sizes='56px'
                      className='object-cover'
                    />
                    <span className='bg-accent text-accent-foreground absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full text-[10px] font-semibold'>
                      {item.quantity}
                    </span>
                  </div>
                  <Flex direction='column' gap={0.5} className='min-w-0 flex-1'>
                    <Typography.Small weight='medium' className='line-clamp-2 leading-snug'>
                      {getCartItemName(item)}
                    </Typography.Small>
                    {item.selected_color || item.selected_size ? (
                      <Typography.Muted className='text-xs'>
                        {[item.selected_color, item.selected_size].filter(Boolean).join(' · ')}
                      </Typography.Muted>
                    ) : null}
                  </Flex>
                  <Typography.Small
                    weight='semibold'
                    className={cn(cartMoneyClassName, 'shrink-0 tabular-nums')}
                  >
                    {formatCartMoney((item.price ?? 0) * (item.quantity ?? 0))}
                  </Typography.Small>
                </li>
              ))}
            </ul>

            <div className='mt-4'>
              <CheckoutSummaryCoupons form={form} />
            </div>

            <Separator className='my-4' />

            <Flex direction='column' gap={2.5}>
              <Flex justify='between' align='center'>
                <Typography.Muted className='text-sm'>{tSummary('subtotal')}</Typography.Muted>
                <Typography.Small className={cartMoneyClassName}>
                  {formatCartMoney(subtotal)}
                </Typography.Small>
              </Flex>
              <Flex justify='between' align='center'>
                <Typography.Muted className='text-sm'>{tSummary('shipping')}</Typography.Muted>
                <Typography.Small className={cartMoneyClassName}>
                  {shippingPrice === 0 ? (
                    hasFreeShipping && providerRate > 0 ? (
                      <Flex align='center' gap={2}>
                        <span className='text-muted-foreground text-xs line-through'>
                          {formatCartMoney(providerRate)}
                        </span>
                        <span className='font-medium text-emerald-600 dark:text-emerald-400'>
                          {tSummary('free')}
                        </span>
                      </Flex>
                    ) : (
                      <span className='font-medium text-emerald-600 dark:text-emerald-400'>
                        {tSummary('free')}
                      </span>
                    )
                  ) : (
                    formatCartMoney(shippingPrice)
                  )}
                </Typography.Small>
              </Flex>
              <Flex justify='between' align='center'>
                <Typography.Muted className='text-sm'>
                  {settings.estimatedTaxEnabled
                    ? tSummary('estimatedTax', {
                        rate: formatEstimatedTaxLabel(settings.estimatedTaxRate)
                      })
                    : tSummary('tax')}
                </Typography.Muted>
                <Typography.Small className={cartMoneyClassName}>
                  {formatCartMoney(tax)}
                </Typography.Small>
              </Flex>
              {couponDiscount > 0 ? (
                <Flex justify='between' align='center'>
                  <Typography.Small className='text-emerald-600 dark:text-emerald-400'>
                    {tSummary('discount')}
                    {appliedCouponCode ? ` (${appliedCouponCode})` : ''}
                  </Typography.Small>
                  <Typography.Small
                    className={cn(cartMoneyClassName, 'text-emerald-600 dark:text-emerald-400')}
                  >
                    −{formatCartMoney(couponDiscount)}
                  </Typography.Small>
                </Flex>
              ) : null}
            </Flex>

            <Separator className='my-4' />

            <Flex justify='between' align='center'>
              <Typography.Text weight='semibold'>{tSummary('total')}</Typography.Text>
              <Typography.Text className={cn(cartMoneyClassName, 'text-xl font-bold')}>
                {formatCartMoney(total)}
              </Typography.Text>
            </Flex>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }
});
