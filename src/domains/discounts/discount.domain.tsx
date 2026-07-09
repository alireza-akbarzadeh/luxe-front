'use client';

import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { DiscountKpiCards } from '@/domains/discounts/sections/discount-kpi-cards';
import { DiscountTable } from '@/domains/discounts/sections/discount-table';

export function DiscountDomain() {
  return (
    <Flex direction='column' className='gap-6'>
      <Flex direction='column' spacing={1}>
        <Typography.H2>Discounts</Typography.H2>
        <Typography.Muted>
          Create and manage coupon codes, automatic promotions, BOGO offers, and usage limits.
        </Typography.Muted>
      </Flex>

      <DiscountKpiCards />

      <DiscountTable />
    </Flex>
  );
}
