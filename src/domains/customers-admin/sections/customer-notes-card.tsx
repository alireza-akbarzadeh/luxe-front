'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Textarea } from '@/components/ui/textarea';
import { Text } from '@/components/ui/typography';
import type { DtoAdminCustomerDetailResponse } from '@/services/-admin-users-{id}-get.schemas';
import { usePatchAdminUsersIdNotes } from '@/services/-admin-users-{id}-notes-patch';

interface CustomerNotesCardProps {
  userId: number;
  notes?: string;
  onSaved: (customer: DtoAdminCustomerDetailResponse) => void;
}

/** Admin notes editor for a customer profile. */
export function CustomerNotesCard({ userId, notes = '', onSaved }: CustomerNotesCardProps) {
  const [draft, setDraft] = useState(notes);
  const { mutateAsync: saveNotes, isPending } = usePatchAdminUsersIdNotes();

  const hasChanges = draft !== notes;

  const handleSave = async () => {
    try {
      const result = await saveNotes({ id: userId, data: { admin_notes: draft } });
      const updated = result.data;
      if (updated) {
        onSaved(updated);
        setDraft(updated.admin_notes ?? draft);
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
          Internal notes for your team — not visible to customers.
        </Text>
        <Textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder='Notes about this customer…'
          rows={4}
          maxLength={2048}
          className='min-h-24 resize-y text-sm'
        />
      </div>
    </div>
  );
}
