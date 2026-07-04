'use client';

import type { ReactNode } from 'react';

import { Shimmer } from '@/components/ai/shimmer';
import { Flex } from '@/components/ui/flex';

type AiThinkingRowProps = {
  avatar: ReactNode;
  label: string;
};

/** Loading row with avatar + shimmer text for AI chat sheets. */
export function AiThinkingRow({ avatar, label }: AiThinkingRowProps) {
  return (
    <Flex direction='row' align='start' spacing={2} className='mb-3 items-start'>
      {avatar}
      <Shimmer as='span' className='text-muted-foreground text-sm'>
        {label}
      </Shimmer>
    </Flex>
  );
}
