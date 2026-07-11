'use client';

import { useTranslations } from 'next-intl';

import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';

import { CheckoutMobileSummaryBody } from './checkout-mobile-summary-body';

/** In-page order summary on small screens (complements the fixed checkout action bar). */
export function CheckoutMobileInlineSummary() {
  const tSummary = useTranslations('checkout.summary');

  return (
    <section
      id='checkout-order-summary'
      aria-labelledby='checkout-order-summary-heading'
      className='bg-card border-border/50 mt-8 rounded-2xl border p-4 shadow-sm lg:hidden'
    >
      <Typography.H2 id='checkout-order-summary-heading' className='mb-4 text-lg font-semibold'>
        {tSummary('title')}
      </Typography.H2>
      <Flex direction='column' spacing={0}>
        <CheckoutMobileSummaryBody showItems={false} showCoupons showTotals />
      </Flex>
    </section>
  );
}
