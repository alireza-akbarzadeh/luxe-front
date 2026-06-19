'use client';

import { Flex } from '@/components/ui/flex';
import { DiscountKpiCards } from '@/domains/discounts/sections/discount-kpi-cards';
import { DiscountTable } from '@/domains/discounts/sections/discount-table';

export function DiscountDomain() {
  return (
    <Flex direction='column' className='gap-6'>
      <div>
        <h1 className='text-2xl font-semibold tracking-tight'>Discounts</h1>
        <p className='text-muted-foreground mt-1 text-sm'>
          Create and manage coupon codes, usage limits, and promotional campaigns.
        </p>
      </div>

      <DiscountKpiCards />

      <DiscountTable />
    </Flex>
  );
}
