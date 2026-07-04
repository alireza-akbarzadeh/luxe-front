// components/checkout-summary.tsx
'use client';

import { IconLock, IconShieldCheck, IconShieldLock } from '@tabler/icons-react';
import { useStore } from '@tanstack/react-form';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { useTypedAppFormContext } from '@/components/forms/useAppForm';
import { AppImage } from '@/components/ui/app-image';
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
import { checkoutDefaultValues } from '@/domains/checkout/schemas/checkout.schema';
import { useCartController } from '@/hooks/useCartController';
import { cn } from '@/lib/utils';

import { useCheckoutTotals } from '../hooks/useCartTotal';
import { useStripeCheckoutEnabled } from '../hooks/useStripeCheckoutEnabled';
import { CheckoutSummaryCoupons } from './checkout-summary-coupons';

export function CheckoutSummary() {
  const t = useTranslations('checkout.summary');
  const form = useTypedAppFormContext({ defaultValues: checkoutDefaultValues });
  const { items } = useCartController();
  const { isStripeCheckout } = useStripeCheckoutEnabled();
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className='bg-card border-border/50 sticky top-24 overflow-hidden rounded-2xl border shadow-sm'
    >
      <Flex direction='column' spacing={0} className='p-5 sm:p-6'>
        <Typography.H4 className='text-lg font-semibold'>{t('title')}</Typography.H4>

        <FreeShippingProgress subtotal={subtotal} className='mt-4' />

        <div className='mt-4 max-h-56 space-y-3 overflow-y-auto pr-0.5'>
          {items.map((item) => (
            <Flex
              key={`${item.id}-${item.color}-${item.size}`}
              direction='row'
              align='center'
              spacing={3}
            >
              <div className='bg-muted relative h-14 w-14 shrink-0 overflow-hidden rounded-xl'>
                <AppImage
                  src={getCartItemImage(item)}
                  alt={getCartItemName(item)}
                  fill
                  className='object-cover'
                  sizes='56px'
                />
                <span className='bg-accent text-accent-foreground absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-medium'>
                  {item.quantity}
                </span>
              </div>
              <Flex direction='column' className='min-w-0 flex-1'>
                <Typography.Text variant='small' className='truncate'>
                  {getCartItemName(item)}
                </Typography.Text>
                {(item.color || item.size) && (
                  <Typography.Text variant='subtle'>
                    {[item.color, item.size].filter(Boolean).join(' / ')}
                  </Typography.Text>
                )}
              </Flex>
              <Typography.Text
                variant='small'
                className={cn(cartMoneyClassName, 'shrink-0 font-medium')}
              >
                {formatCartMoney((item.price ?? 0) * (item.quantity ?? 0))}
              </Typography.Text>
            </Flex>
          ))}
        </div>

        <CheckoutSummaryCoupons />

        <Separator className='my-4' />

        <Flex direction='column' spacing={2}>
          <Flex direction='row' justify='between' align='center'>
            <Typography.Text variant='muted'>{t('subtotal')}</Typography.Text>
            <Typography.Text variant='small' className={cartMoneyClassName}>
              {formatCartMoney(subtotal)}
            </Typography.Text>
          </Flex>
          <Flex direction='row' justify='between' align='center'>
            <Typography.Text variant='muted'>{t('shipping')}</Typography.Text>
            <Typography.Text variant='small' className={cartMoneyClassName}>
              {shippingPrice === 0 ? (
                hasFreeShipping && providerRate > 0 ? (
                  <Flex direction='row' align='center' spacing={2}>
                    <span className='text-muted-foreground line-through'>
                      {formatCartMoney(providerRate)}
                    </span>
                    <Typography.Text variant='small' tone='success'>
                      {t('free')}
                    </Typography.Text>
                  </Flex>
                ) : (
                  <Typography.Text variant='small' tone='success'>
                    {t('free')}
                  </Typography.Text>
                )
              ) : (
                formatCartMoney(shippingPrice)
              )}
            </Typography.Text>
          </Flex>
          <Flex direction='row' justify='between' align='center'>
            <Typography.Text variant='muted'>
              {settings.estimatedTaxEnabled
                ? t('estimatedTax', {
                    rate: formatEstimatedTaxLabel(settings.estimatedTaxRate)
                  })
                : t('tax')}
            </Typography.Text>
            <Typography.Text variant='small' className={cartMoneyClassName}>
              {formatCartMoney(tax)}
            </Typography.Text>
          </Flex>
          {couponDiscount > 0 ? (
            <Flex direction='row' justify='between' align='center'>
              <Typography.Text variant='small' tone='success'>
                {t('discount')}
                {appliedCouponCode ? ` (${appliedCouponCode})` : ''}
              </Typography.Text>
              <Typography.Text variant='small' tone='success' className={cartMoneyClassName}>
                −{formatCartMoney(couponDiscount)}
              </Typography.Text>
            </Flex>
          ) : null}
        </Flex>

        <Separator className='my-4' />

        <Flex direction='row' justify='between' align='center'>
          <Typography.Text variant='large'>{t('total')}</Typography.Text>
          <Typography.Text variant='h4' className={cn(cartMoneyClassName, 'text-2xl font-bold')}>
            {formatCartMoney(total)}
          </Typography.Text>
        </Flex>

        {isStripeCheckout ? (
          <Flex
            direction='row'
            align='start'
            spacing={2}
            className='border-accent/20 bg-accent/5 mt-4 rounded-xl border px-3 py-3'
          >
            <IconShieldLock className='text-accent mt-0.5 h-4 w-4 shrink-0' />
            <Typography.Text variant='subtle'>{t('stripeNote')}</Typography.Text>
          </Flex>
        ) : null}

        <Flex
          direction='row'
          align='center'
          justify='center'
          spacing={4}
          className='border-border/60 mt-5 border-t pt-4'
        >
          <Flex direction='row' align='center' spacing={1}>
            <IconShieldCheck className='text-muted-foreground h-4 w-4' />
            <Typography.Text variant='subtle'>{t('secureCheckout')}</Typography.Text>
          </Flex>
          <Flex direction='row' align='center' spacing={1}>
            <IconLock className='text-muted-foreground h-4 w-4' />
            <Typography.Text variant='subtle'>{t('encrypted')}</Typography.Text>
          </Flex>
        </Flex>
      </Flex>
    </motion.div>
  );
}
