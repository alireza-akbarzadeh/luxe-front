'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Textarea } from '@/components/ui/textarea';
import { Text } from '@/components/ui/typography';
import { usePatchOrdersIdNotes } from '@/services/-orders-{id}-notes-patch';

interface OrderNotesCardProps {
  orderId: number;
  notes?: string;
  onSaved: () => void;
}

/** Admin notes editor for an order detail page. */
export function OrderNotesCard({ orderId, notes = '', onSaved }: OrderNotesCardProps) {
  const [draft, setDraft] = useState(notes);
  const { mutateAsync: saveNotes, isPending } = usePatchOrdersIdNotes();

  const hasChanges = draft !== notes;

  const handleSave = async () => {
    try {
      await saveNotes({ id: orderId, data: { notes: draft } });
      onSaved();
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
        {hasChanges ? (
          <Button type='button' size='sm' disabled={isPending} onClick={() => void handleSave()}>
            {isPending ? 'Saving…' : 'Save'}
          </Button>
        ) : null}
      </Flex>
      <div className='p-6'>
        <Textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder='Internal notes about this order…'
          rows={4}
          maxLength={2000}
          className='min-h-24 resize-y text-sm'
        />
        <Text variant='muted' className='mt-2 text-[10px]'>
          Visible to admins only. {draft.length}/2000
        </Text>
      </div>
    </div>
  );
}
