'use client';

import { IconPencil } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';

import type { CheckoutReviewSectionProps } from '../types/checkout.types';

export function CheckoutReviewSection({
  title,
  icon,
  onEdit,
  children
}: CheckoutReviewSectionProps) {
  return (
    <section className='bg-card border-border/60 rounded-xl border p-4 sm:p-5'>
      <Flex direction='row' align='center' justify='between' className='mb-3'>
        <Typography.Text variant='small' className='flex items-center gap-2 font-semibold'>
          <span className='text-muted-foreground'>{icon}</span>
          {title}
        </Typography.Text>
        {onEdit ? (
          <Button
            type='button'
            variant='ghost'
            size='sm'
            className='text-accent h-auto gap-1 px-2 py-1'
            onClick={onEdit}
          >
            <IconPencil className='h-3.5 w-3.5' />
            Edit
          </Button>
        ) : null}
      </Flex>
      {children}
    </section>
  );
}
