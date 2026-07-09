'use client';

import { IconLoader2 } from '@tabler/icons-react';
import { useState } from 'react';

import { AppDialog } from '@/components/app-dialog';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getQueueAction } from '@/domains/fulfillment/lib/fulfillment-queues';
import type { FulfillmentShipDialogState } from '@/domains/fulfillment/types/fulfillment.types';

interface FulfillmentActionDialogProps {
  target: FulfillmentShipDialogState | null;
  isPending: boolean;
  onClose: () => void;
  onConfirm: (input: { note?: string; trackingNumber?: string }) => Promise<void>;
}

export function FulfillmentActionDialog({
  target,
  isPending,
  onClose,
  onConfirm
}: FulfillmentActionDialogProps) {
  const [note, setNote] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  if (!target) return null;

  const action = getQueueAction(target.queue);
  const requiresTracking = action.requiresTracking;
  const orderLabel = target.order.order_number ?? `#${target.order.id ?? ''}`;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setNote('');
      setTrackingNumber('');
      onClose();
    }
  };

  const handleConfirm = async () => {
    await onConfirm({
      note,
      trackingNumber: requiresTracking ? trackingNumber : undefined
    });
    setNote('');
    setTrackingNumber('');
  };

  return (
    <AppDialog
      open
      onOpenChange={handleOpenChange}
      title={action.label}
      description={`Order ${orderLabel}`}
      size='sm'
    >
      <Flex direction='column' spacing={4}>
        {requiresTracking ? (
          <Flex direction='column' spacing={2}>
            <Label htmlFor='fulfillment-tracking'>Tracking number</Label>
            <Input
              id='fulfillment-tracking'
              value={trackingNumber}
              onChange={(event) => setTrackingNumber(event.target.value)}
              placeholder='Carrier tracking ID'
              className='rounded-xl'
            />
          </Flex>
        ) : null}

        <Flex direction='column' spacing={2}>
          <Label htmlFor='fulfillment-note'>
            Note <span className='text-muted-foreground font-normal'>(optional)</span>
          </Label>
          <Textarea
            id='fulfillment-note'
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={3}
            maxLength={512}
            className='rounded-xl'
          />
        </Flex>

        <Flex justify='end' spacing={2}>
          <Button type='button' variant='ghost' onClick={onClose}>
            Cancel
          </Button>
          <Button
            type='button'
            disabled={isPending || (requiresTracking && !trackingNumber.trim())}
            onClick={() => void handleConfirm()}
          >
            {isPending ? (
              <>
                <IconLoader2 className='size-4 animate-spin' />
                Applying…
              </>
            ) : (
              action.label
            )}
          </Button>
        </Flex>
      </Flex>
    </AppDialog>
  );
}
