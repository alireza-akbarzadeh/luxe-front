'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { useCartController } from '@/hooks/useCartController';

import { useCartCheckoutAction } from '../hooks/use-cart-checkout-action';
import { CartMobileSummaryBody } from './cart-mobile-summary-body';

/** Scrollable order summary for the cart page on small screens (above the fixed checkout bar). */
export function CartMobileInlineSummary() {
  const t = useTranslations('cart.page');
  const tMobile = useTranslations('cart.mobileSummary');
  const { items, itemCount } = useCartController();
  const { hasIncompleteVariants, proceedToCheckout } = useCartCheckoutAction(items);

  return (
    <section
      id='cart-order-summary'
      aria-labelledby='cart-order-summary-heading'
      className='bg-card border-border/50 mt-6 rounded-2xl border p-4 shadow-sm lg:hidden'
    >
      <Typography.H2 id='cart-order-summary-heading' className='mb-4 text-lg font-semibold'>
        {tMobile('viewSummary')}
      </Typography.H2>
      <CartMobileSummaryBody showItems={false} showTotals />
      <Flex direction='column' gap={2} className='mt-4'>
        {hasIncompleteVariants ? (
          <Typography.Muted className='text-warning text-xs leading-relaxed'>
            {t('variantWarning')}
          </Typography.Muted>
        ) : null}
        <Button
          type='button'
          size='lg'
          className='h-12 w-full rounded-2xl font-semibold'
          disabled={itemCount === 0 || hasIncompleteVariants}
          onClick={() => proceedToCheckout()}
        >
          {t('proceedToCheckout')}
        </Button>
      </Flex>
    </section>
  );
}
