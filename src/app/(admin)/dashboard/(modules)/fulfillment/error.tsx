'use client';

import { IconAlertTriangle } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Text } from '@/components/ui/typography';

export default function FulfillmentError({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Flex
      direction='column'
      align='center'
      justify='center'
      className='min-h-[320px] gap-4 rounded-xl border border-dashed p-8 text-center'
    >
      <IconAlertTriangle className='text-destructive size-10' aria-hidden />
      <Flex direction='column' className='gap-1'>
        <Text variant='h4' as='h2'>
          Fulfillment center unavailable
        </Text>
        <Text variant='muted' as='p'>
          Something went wrong loading fulfillment queues. Try again or return to the dashboard.
        </Text>
      </Flex>
      <Button type='button' variant='outline' onClick={reset}>
        Try again
      </Button>
    </Flex>
  );
}
