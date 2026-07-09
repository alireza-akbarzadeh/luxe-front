'use client';

import { IconLoader2 } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { useReturnTransition } from '@/domains/returns-admin/hooks/use-return-transition';
import type { DtoReturnResponse } from '@/services/-admin-returns-{id}-get.schemas';

interface ReturnQuickActionsProps {
  returnItem: DtoReturnResponse;
  onUpdated: () => void;
}

/** Contextual workflow shortcuts for common return approval steps. */
export function ReturnQuickActions({ returnItem, onUpdated }: ReturnQuickActionsProps) {
  const { applyTransition, isPending } = useReturnTransition(onUpdated);
  const returnId = returnItem.id;
  const status = returnItem.status ?? returnItem.state?.code ?? 'requested';
  const returnType = returnItem.return_type ?? 'refund';

  if (!returnId) return null;

  const handle = (event: string) => {
    void applyTransition(returnId, event);
  };

  if (status === 'requested') {
    return (
      <Flex direction='row' wrap='wrap' className='gap-2'>
        <Button type='button' size='sm' disabled={isPending} onClick={() => handle('approve')}>
          {isPending ? <IconLoader2 className='size-4 animate-spin' /> : 'Approve'}
        </Button>
        <Button
          type='button'
          size='sm'
          variant='outline'
          disabled={isPending}
          onClick={() => handle('reject')}
        >
          Reject
        </Button>
      </Flex>
    );
  }

  if (status === 'approved') {
    return (
      <Button type='button' size='sm' disabled={isPending} onClick={() => handle('receive_item')}>
        {isPending ? <IconLoader2 className='size-4 animate-spin' /> : 'Mark item received'}
      </Button>
    );
  }

  if (status === 'item_received') {
    return (
      <Flex direction='row' wrap='wrap' className='gap-2'>
        {returnType === 'exchange' ? (
          <Button
            type='button'
            size='sm'
            disabled={isPending}
            onClick={() => handle('start_exchange')}
          >
            {isPending ? <IconLoader2 className='size-4 animate-spin' /> : 'Start exchange'}
          </Button>
        ) : (
          <Button
            type='button'
            size='sm'
            disabled={isPending}
            onClick={() => handle('start_refund')}
          >
            {isPending ? <IconLoader2 className='size-4 animate-spin' /> : 'Start refund'}
          </Button>
        )}
      </Flex>
    );
  }

  if (status === 'refund_processing') {
    return (
      <Button
        type='button'
        size='sm'
        disabled={isPending}
        onClick={() => handle('complete_refund')}
      >
        {isPending ? <IconLoader2 className='size-4 animate-spin' /> : 'Complete refund'}
      </Button>
    );
  }

  if (status === 'exchange_processing') {
    return (
      <Button
        type='button'
        size='sm'
        disabled={isPending}
        onClick={() => handle('complete_exchange')}
      >
        {isPending ? <IconLoader2 className='size-4 animate-spin' /> : 'Complete exchange'}
      </Button>
    );
  }

  if (status === 'refunded' || status === 'exchange_completed' || status === 'rejected') {
    return (
      <Button
        type='button'
        size='sm'
        variant='outline'
        disabled={isPending}
        onClick={() => handle('close')}
      >
        {isPending ? <IconLoader2 className='size-4 animate-spin' /> : 'Close case'}
      </Button>
    );
  }

  return null;
}
