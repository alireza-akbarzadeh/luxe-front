'use client';

import { IconCheck } from '@tabler/icons-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Text } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

interface PlatformCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  badge?: string;
  recommended?: boolean;
  disabled?: boolean;
  actionLabel?: string;
  href?: string;
  onAction?: () => void;
  helperText?: string;
  className?: string;
}

export function PlatformCard({
  icon,
  title,
  description,
  badge,
  recommended,
  disabled,
  actionLabel,
  href,
  onAction,
  helperText,
  className
}: PlatformCardProps) {
  const actionButton = actionLabel ? (
    href ? (
      <Button asChild className='rounded-full' variant={disabled ? 'outline' : 'default'}>
        <Link href={href} aria-disabled={disabled}>
          {actionLabel}
        </Link>
      </Button>
    ) : (
      <Button
        className='rounded-full'
        variant={disabled ? 'outline' : 'default'}
        onClick={onAction}
        disabled={disabled}
      >
        {actionLabel}
      </Button>
    )
  ) : null;

  return (
    <Flex
      direction='column'
      gap={4}
      className={cn(
        'bg-card/90 border-border/50 relative z-10 rounded-2xl border p-5 shadow-xs transition-colors sm:p-6',
        recommended && 'border-accent/35 bg-accent/5 shadow-sm',
        className
      )}
    >
      <Flex align='start' justify='between' gap={3}>
        <Flex
          align='center'
          justify='center'
          className='bg-muted text-foreground size-11 rounded-2xl'
        >
          {icon}
        </Flex>
        {badge ? (
          <span
            className={cn(
              'bg-muted text-muted-foreground rounded-full px-2.5 py-1 text-xs font-medium',
              recommended && 'bg-accent/10 text-accent'
            )}
          >
            {recommended ? <IconCheck className='me-1 inline size-3.5' /> : null}
            {badge}
          </span>
        ) : null}
      </Flex>

      <Flex direction='column' gap={1.5} className='flex-1'>
        <Text variant='large' className='text-foreground leading-snug'>
          {title}
        </Text>
        <Text variant='muted' className='text-sm leading-relaxed'>
          {description}
        </Text>
      </Flex>

      {actionButton ? <div className='mt-auto pt-1'>{actionButton}</div> : null}

      {helperText ? (
        <Text variant='subtle' className='text-muted-foreground'>
          {helperText}
        </Text>
      ) : null}
    </Flex>
  );
}
