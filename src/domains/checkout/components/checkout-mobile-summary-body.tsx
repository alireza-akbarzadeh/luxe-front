'use client';

import { useStore } from '@tanstack/react-form';
import { useTranslations } from 'next-intl';

import { useTypedAppFormContext } from '@/components/forms/useAppForm';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { FreeShippingProgress } from '@/domains/cart/components/free-shipping-progress';
import { formatEstimatedTaxLabel } from '@/domains/cart/lib/cart-commerce-settings';
import { cartMoneyClassName, formatCartMoney } from '@/domains/cart/lib/cart-utils';
import { useCartController } from '@/hooks/useCartController';
import { cn } from '@/lib/utils';

import { useCheckoutTotals } from '../hooks/useCartTotal';
import { checkoutDefaultValues } from '../schemas/checkout.schema';
import { CheckoutMobileAddItemsButton } from './checkout-mobile-add-items-button';
import { CheckoutMobileSummaryItem } from './checkout-mobile-summary-item';
import { CheckoutSummaryCoupons } from './checkout-summary-coupons';

interface CheckoutMobileSummaryBodyProps {
  /** Line items + add-more — hidden at the mid snap level. */
  showItems?: boolean;
  /** Coupon field — shown from mid snap upward. */
  showCoupons?: boolean;
  /** Subtotal / shipping / tax block — shown from mid snap upward. */
  showTotals?: boolean;
}

/** Scrollable order breakdown for the mobile checkout snap drawer. */
export function CheckoutMobileSummaryBody({
  showItems = true,
  showCoupons = true,
  showTotals = true
}: CheckoutMobileSummaryBodyProps) {
  const tSummary = useTranslations('checkout.summary');
  const tMobile = useTranslations('checkout.mobileSummary');
  const form = useTypedAppFormContext({ defaultValues: checkoutDefaultValues });
  const { items, updateCartItemQuantity, removeCartItem, updatingItemId, removingItemId } =
    useCartController();
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
    <div className='pb-2'>
      <FreeShippingProgress subtotal={subtotal} className='mt-1' />

      {showItems ? (
        <>
          <ul className='mt-4 flex flex-col gap-3'>
            {items.map((item) => {
              const cartItemId = Number(item.id);
              const quantity = item.quantity ?? 0;

              return (
                <CheckoutMobileSummaryItem
                  key={`${item.id}-${item.selected_color}-${item.selected_size}`}
                  item={item}
                  isUpdating={updatingItemId === cartItemId}
                  isRemoving={removingItemId === cartItemId}
                  decreaseLabel={tMobile('decreaseQuantity')}
                  increaseLabel={tMobile('increaseQuantity')}
                  removeLabel={tMobile('removeItem', { name: item.product_name ?? '' })}
                  onDecrease={() => {
                    if (quantity <= 1) {
                      removeCartItem(cartItemId);
                      return;
                    }
                    updateCartItemQuantity(cartItemId, quantity - 1);
                  }}
                  onIncrease={() => {
                    if (quantity >= (item.stock ?? 99)) return;
                    updateCartItemQuantity(cartItemId, quantity + 1);
                  }}
                  onRemove={() => removeCartItem(cartItemId)}
                />
              );
            })}
          </ul>

          <CheckoutMobileAddItemsButton className='border-gold/30 hover:border-gold/50 mt-3 h-12 w-full rounded-2xl border-dashed' />
        </>
      ) : null}

      {showCoupons ? (
        <div className={cn(showItems ? 'mt-4' : 'mt-2')}>
          <CheckoutSummaryCoupons />
        </div>
      ) : null}

      {showTotals ? (
        <Flex
          direction='column'
          gap={2.5}
          className={cn('bg-muted/40 rounded-2xl p-4', showItems || showCoupons ? 'mt-4' : 'mt-2')}
        >
          <Flex direction='row' justify='between' align='center' className='min-w-0 gap-3'>
            <Typography.Muted className='text-sm'>{tSummary('subtotal')}</Typography.Muted>
            <Typography.Small className={cartMoneyClassName}>
              {formatCartMoney(subtotal)}
            </Typography.Small>
          </Flex>
          <Flex direction='row' justify='between' align='center' className='min-w-0 gap-3'>
            <Typography.Muted className='text-sm'>{tSummary('shipping')}</Typography.Muted>
            <Typography.Small className={cartMoneyClassName}>
              {shippingPrice === 0 ? (
                hasFreeShipping && providerRate > 0 ? (
                  <Flex direction='row' align='center' gap={2}>
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
          <Flex direction='row' justify='between' align='center' className='min-w-0 gap-3'>
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
            <Flex direction='row' justify='between' align='center' className='min-w-0 gap-3'>
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

          <Flex
            direction='row'
            justify='between'
            align='center'
            className='border-border/60 mt-1 min-w-0 gap-3 border-t pt-2.5'
          >
            <Typography.Text weight='semibold'>{tSummary('total')}</Typography.Text>
            <Typography.Text className={cn(cartMoneyClassName, 'text-xl font-bold')}>
              {formatCartMoney(total)}
            </Typography.Text>
          </Flex>
        </Flex>
      ) : null}
    </div>
  );
}
