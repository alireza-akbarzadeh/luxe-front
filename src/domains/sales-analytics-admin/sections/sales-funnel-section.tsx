'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import type { DtoAdminSalesFunnelStep } from '@/services/-admin-analytics-sales-get.schemas';

interface SalesFunnelSectionProps {
  steps?: DtoAdminSalesFunnelStep[];
}

export function SalesFunnelSection({ steps = [] }: SalesFunnelSectionProps) {
  const maxCount = steps[0]?.count ?? 1;

  return (
    <Card className='border-0 shadow-none'>
      <CardHeader>
        <CardTitle>Order funnel</CardTitle>
        <CardDescription>Lifecycle conversion from created orders to delivered</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        {steps.length === 0 ? (
          <Typography.Muted>No funnel data for this period.</Typography.Muted>
        ) : (
          steps.map((step) => {
            const width =
              maxCount > 0 ? Math.max(8, (Number(step.count ?? 0) / maxCount) * 100) : 8;
            return (
              <Flex key={step.step} direction='column' className='gap-2'>
                <Flex align='center' justify='between' className='text-sm'>
                  <span className='font-medium'>{step.step}</span>
                  <span className='text-muted-foreground tabular-nums'>
                    {(step.count ?? 0).toLocaleString()} · {step.rate ?? 0}%
                  </span>
                </Flex>
                <div className='bg-muted h-2 overflow-hidden rounded-full'>
                  <div
                    className='bg-primary h-full rounded-full transition-all'
                    style={{ width: `${width}%` }}
                  />
                </div>
              </Flex>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
