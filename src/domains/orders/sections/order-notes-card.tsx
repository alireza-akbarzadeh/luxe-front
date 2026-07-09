'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Textarea } from '@/components/ui/textarea';
import { Text } from '@/components/ui/typography';
import type { DtoAdminOrderDetailResponse } from '@/services/-orders-{id}-get.schemas';
import { usePatchOrdersIdNotes } from '@/services/-orders-{id}-notes-patch';

interface OrderNotesCardProps {
  orderId: number;
  notes?: string;
  onSaved: (order: DtoAdminOrderDetailResponse) => void;
}

/** Admin notes editor for an order detail page. */
export function OrderNotesCard({ orderId, notes = '', onSaved }: OrderNotesCardProps) {
  const [draft, setDraft] = useState(notes);
  const { mutateAsync: saveNotes, isPending } = usePatchOrdersIdNotes();

  const hasChanges = draft !== notes;

  const handleSave = async () => {
    try {
      const result = await saveNotes({ id: orderId, data: { notes: draft } });
      const updated = result.data;
      if (updated) {
        onSaved(updated);
        setDraft(updated.notes ?? draft);
      }
      toast.success('Notes saved');
    } catch (error) {
      toast.error('Could not save notes', {
        description: error instanceof Error ? error.message : 'Something went wrong'
      });
    }
  };

  return (
    <div className='bg-card border-border/40 overflow-hidden rounded-2xl border shadow-sm'>
      <Flex
        direction='row'
        align='center'
        justify='between'
        className='bg-muted/20 border-border/10 border-b px-6 py-4'
      >
        <Text variant='overline' className='text-muted-foreground'>
          Admin notes
        </Text>
        <Button
          type='button'
          size='sm'
          disabled={isPending || !hasChanges}
          onClick={() => void handleSave()}
        >
          {isPending ? 'Saving…' : 'Save notes'}
        </Button>
      </Flex>
      <div className='p-6'>
        <Text variant='muted' className='mb-3 text-[11px]'>
          Internal notes for your team only — not shown to customers.
        </Text>
        <Textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder='Internal notes about this order…'
          rows={4}
          maxLength={2000}
          className='min-h-24 resize-y text-sm'
        />
        <Text variant='muted' className='mt-2 text-[10px]'>
          {draft.length}/2000 characters
        </Text>
      </div>
    </div>
  );
}
