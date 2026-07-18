import { IconCheck } from '@tabler/icons-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { formatDate } from '@/lib/date';
import { cn } from '@/lib/utils';
import type { DtoSimulateDeliveryResponse } from '@/services/-admin-calendar-simulate-post.schemas';

const DEMO_STEPS = [
  { step: 'order_placed', label: 'Order Placed' },
  { step: 'processing', label: 'Processing' },
  { step: 'shipped', label: 'Shipped' },
  { step: 'delivered', label: 'Delivered' }
];

interface DeliveryCalculatorCardProps {
  result: DtoSimulateDeliveryResponse | undefined;
}

/** Horizontal timeline visualizing the latest delivery simulation (or a placeholder demo). */
export function DeliveryCalculatorCard({ result }: DeliveryCalculatorCardProps) {
  const timeline = result?.timeline?.length
    ? result.timeline
    : DEMO_STEPS.map((step) => ({ step: step.step, label: step.label, date: undefined, days: undefined }));
  const isDemo = !result?.timeline?.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Date Calculator</CardTitle>
        <CardDescription>
          {isDemo ? 'Run a simulation to see real dates' : 'Latest simulation timeline'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Flex direction='column' spacing={4}>
          <Flex direction='row' align='center' className='overflow-x-auto pb-1'>
            {timeline.map((step, index) => (
              <Flex key={step.step ?? index} direction='row' align='center' className='shrink-0'>
                <Flex direction='column' align='center' spacing={1} className='w-24 text-center'>
                  <Flex
                    align='center'
                    justify='center'
                    className={cn(
                      'size-8 rounded-full border-2',
                      isDemo ? 'border-muted bg-muted text-muted-foreground' : 'border-primary bg-primary/10 text-primary'
                    )}
                  >
                    {isDemo ? (
                      <Typography.Text className='text-xs font-semibold'>{index + 1}</Typography.Text>
                    ) : (
                      <IconCheck className='size-4' />
                    )}
                  </Flex>
                  <Typography.Text className='text-xs font-medium'>{step.label}</Typography.Text>
                  {step.date && (
                    <Typography.Muted className='text-[11px]'>{formatDate(step.date)}</Typography.Muted>
                  )}
                </Flex>
                {index < timeline.length - 1 && (
                  <div
                    className={cn('mx-1 h-px w-8 flex-1', isDemo ? 'bg-muted' : 'bg-primary/40')}
                    aria-hidden
                  />
                )}
              </Flex>
            ))}
          </Flex>

          {result?.delivery_date ? (
            <Flex direction='row' align='center' justify='between' className='rounded-lg border bg-primary/5 px-3 py-2.5'>
              <Typography.Text className='text-sm font-medium'>Estimated Delivery</Typography.Text>
              <Typography.Text className='text-sm font-semibold text-primary'>
                {formatDate(result.delivery_date)}
              </Typography.Text>
            </Flex>
          ) : null}

          {result && !result.vendor_available ? (
            <Badge variant='destructive' className='w-fit'>
              Vendor unavailable
            </Badge>
          ) : null}

          {result?.delay_reason ? (
            <Typography.Muted className='text-xs'>Delay reason: {result.delay_reason}</Typography.Muted>
          ) : null}
        </Flex>
      </CardContent>
    </Card>
  );
}
