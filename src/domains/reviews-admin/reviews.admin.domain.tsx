'use client';

import { Flex } from '@/components/ui/flex';
import { ReviewsTable } from '@/domains/reviews-admin/sections/reviews-table';

export function ReviewsAdminDomain() {
  return (
    <Flex direction='column' className='gap-6'>
      <div>
        <h1 className='text-2xl font-semibold tracking-tight'>Product reviews</h1>
        <p className='text-muted-foreground mt-1 text-sm'>
          Moderate customer reviews before they appear on product pages. Approve or reject via the
          review workflow.
        </p>
      </div>

      <ReviewsTable />
    </Flex>
  );
}
