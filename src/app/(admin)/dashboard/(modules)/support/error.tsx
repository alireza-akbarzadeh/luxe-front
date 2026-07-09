'use client';

import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Text } from '@/components/ui/typography';

export default function SupportError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Flex direction='column' align='center' className='gap-4 py-16 text-center'>
      <Text variant='h4' as='h2'>
        Support desk error
      </Text>
      <Text variant='muted' as='p'>
        {error.message || 'Something went wrong loading support.'}
      </Text>
      <Flex className='gap-2'>
        <Button variant='outline' onClick={reset}>
          Try again
        </Button>
        <Button variant='ghost' asChild>
          <Link href='/dashboard/support'>
            <IconArrowLeft className='mr-1 size-4' />
            Back to tickets
          </Link>
        </Button>
      </Flex>
    </Flex>
  );
}
