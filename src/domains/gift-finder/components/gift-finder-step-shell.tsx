'use client';

import type { ReactNode } from 'react';

import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';

type GiftFinderStepShellProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

/** Shared heading wrapper for each wizard step. */
export function GiftFinderStepShell({ title, description, children }: GiftFinderStepShellProps) {
  return (
    <Flex direction='column' spacing={6}>
      <Flex direction='column' spacing={2}>
        <Typography.H2 className='text-2xl font-semibold tracking-tight'>{title}</Typography.H2>
        {description ? (
          <Typography.Muted className='text-base leading-relaxed'>{description}</Typography.Muted>
        ) : null}
      </Flex>
      {children}
    </Flex>
  );
}
