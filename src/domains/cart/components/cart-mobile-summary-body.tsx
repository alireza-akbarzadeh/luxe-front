'use client';

import { useTranslations } from 'next-intl';

import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { formatEstimatedTaxLabel } from '@/domains/cart/lib/cart-commerce-settings';
import { cartMoneyClassName, formatCartMoney } from '@/domains/cart/lib/cart-utils';
import { CheckoutMobileAddItemsButton } from '@/domains/checkout/components/checkout-mobile-add-items-button';
import { CheckoutMobileSummaryItem } from '@/domains/checkout/components/checkout-mobile-summary-item';
import { useCartController } from '@/hooks/useCartController';
import { cn } from '@/lib/utils';

import { useCartOrderEstimate } from '../hooks/use-cart-order-estimate';
import { FreeShippingProgress } from './free-shipping-progress';

interface CartMobileSummaryBodyProps {
  onNavigate?: () => void;
}

/** Scrollable cart breakdown — used in the mobile cart summary drawer. */
export function CartMobileSummaryBody({ onNavigate }: CartMobileSummaryBodyProps) {
  const t = useTranslations('cart.page');
  const tMobile = useTranslations('cart.mobileSummary');
  const {
    items,
    subtotal,
    updateCartItemQuantity,
    removeCartItem,
    updatingItemId,
    removingItemId
  } = useCartController();
  const { totalDiscount, shipping, tax, total, settings } = useCartOrderEstimate(items, subtotal);

  return (
    <div className='pb-2'>
      <FreeShippingProgress subtotal={subtotal} className='mt-1' />

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

      <CheckoutMobileAddItemsButton
        onNavigate={onNavigate}
        className='border-gold/30 hover:border-gold/50 mt-3 h-12 w-full rounded-2xl border-dashed'
      />

      <Flex direction='column' gap={2.5} className='bg-muted/40 mt-4 rounded-2xl p-4'>
        <Flex direction='row' justify='between' align='center' className='min-w-0 gap-3'>
          <Typography.Muted className='text-sm'>{t('subtotal')}</Typography.Muted>
          <Typography.Small className={cartMoneyClassName}>
            {formatCartMoney(subtotal)}
          </Typography.Small>
        </Flex>
        {totalDiscount > 0 ? (
          <Flex direction='row' justify='between' align='center' className='min-w-0 gap-3'>
            <Typography.Small className='text-emerald-600 dark:text-emerald-400'>
              {t('savings')}
            </Typography.Small>
            <Typography.Small
              className={cn(cartMoneyClassName, 'text-emerald-600 dark:text-emerald-400')}
            >
              −{formatCartMoney(totalDiscount)}
            </Typography.Small>
          </Flex>
        ) : null}
        <Flex direction='row' justify='between' align='center' className='min-w-0 gap-3'>
          <Typography.Muted className='text-sm'>{t('shipping')}</Typography.Muted>
          <Typography.Small className={cartMoneyClassName}>
            {shipping === 0 ? (
              <span className='font-medium text-emerald-600 dark:text-emerald-400'>
                {t('freeShipping')}
              </span>
            ) : (
              formatCartMoney(shipping)
            )}
          </Typography.Small>
        </Flex>
        {settings.estimatedTaxEnabled && tax > 0 ? (
          <Flex direction='row' justify='between' align='center' className='min-w-0 gap-3'>
            <Typography.Muted className='text-sm'>
              {t('estimatedTax', { rate: formatEstimatedTaxLabel(settings.estimatedTaxRate) })}
            </Typography.Muted>
            <Typography.Small className={cartMoneyClassName}>
              {formatCartMoney(tax)}
            </Typography.Small>
          </Flex>
        ) : null}

        <Flex
          direction='row'
          justify='between'
          align='center'
          className='border-border/60 mt-1 min-w-0 gap-3 border-t pt-2.5'
        >
          <Typography.Text weight='semibold'>{t('estimatedTotal')}</Typography.Text>
          <Typography.Text className={cn(cartMoneyClassName, 'text-xl font-bold')}>
            {formatCartMoney(total)}
          </Typography.Text>
        </Flex>
        <Typography.Muted className='text-xs leading-relaxed'>{t('taxNote')}</Typography.Muted>
      </Flex>
    </div>
  );
}
