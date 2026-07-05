'use client';

import type { ReactNode } from 'react';

import { Card } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

type PdpInsightShellProps = {
  title: string;
  icon?: ReactNode;
  shellClassName?: string;
  className?: string;
  children?: ReactNode;
};

/** Fixed-height placeholder shell shown before a deferred insight fetch starts. */
export function PdpInsightShell({
  title,
  icon,
  shellClassName,
  className,
  children
}: PdpInsightShellProps) {
  return (
    <Card
      className={cn(
        'border-border/70 from-card to-muted/20 rounded-2xl border bg-linear-to-br p-5 sm:p-6',
        shellClassName,
        className
      )}
      aria-hidden={children ? undefined : true}
    >
      <Flex direction='row' align='center' spacing={2} className='mb-4 min-h-6'>
        {icon}
        <Typography.H3 className='text-base font-semibold tracking-tight'>{title}</Typography.H3>
      </Flex>
      {children ?? <div className='bg-muted/20 min-h-[10rem] rounded-xl' />}
    </Card>
  );
}
