'use client';

import { IconPlus, IconX } from '@tabler/icons-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/typography';
import { usePutOrdersIdTags } from '@/services/-orders-{id}-tags-put';

interface OrderTagsCardProps {
  orderId: number;
  tags?: string[];
  onSaved: () => void;
}

function normalizeTag(value: string) {
  return value.trim().toLowerCase();
}

/** Admin tag editor for an order detail page. */
export function OrderTagsCard({ orderId, tags = [], onSaved }: OrderTagsCardProps) {
  const [draftTags, setDraftTags] = useState(tags);
  const [newTag, setNewTag] = useState('');
  const { mutateAsync: saveTags, isPending } = usePutOrdersIdTags();

  const sortedDraft = [...draftTags].sort();
  const sortedOriginal = [...tags].sort();
  const hasChanges =
    sortedDraft.length !== sortedOriginal.length ||
    sortedDraft.some((tag, index) => tag !== sortedOriginal[index]);

  const addTag = () => {
    const normalized = normalizeTag(newTag);
    if (!normalized) return;
    if (draftTags.includes(normalized)) {
      setNewTag('');
      return;
    }
    if (draftTags.length >= 20) {
      toast.error('Maximum 20 tags per order');
      return;
    }
    setDraftTags((current) => [...current, normalized]);
    setNewTag('');
  };

  const removeTag = (tag: string) => {
    setDraftTags((current) => current.filter((item) => item !== tag));
  };

  const handleSave = async () => {
    try {
      await saveTags({ id: orderId, data: { tags: draftTags } });
      onSaved();
      toast.success('Tags saved');
    } catch (error) {
      toast.error('Could not save tags', {
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
          Tags
        </Text>
        {hasChanges ? (
          <Button type='button' size='sm' disabled={isPending} onClick={() => void handleSave()}>
            {isPending ? 'Saving…' : 'Save'}
          </Button>
        ) : null}
      </Flex>
      <Flex direction='column' spacing={4} className='p-6'>
        <Flex direction='row' wrap='wrap' className='gap-2'>
          {draftTags.length === 0 ? (
            <Text variant='muted' className='text-xs italic'>
              No tags yet
            </Text>
          ) : (
            draftTags.map((tag) => (
              <Badge key={tag} variant='secondary' className='gap-1 pr-1 text-xs'>
                {tag}
                <button
                  type='button'
                  className='hover:bg-muted rounded-full p-0.5'
                  aria-label={`Remove tag ${tag}`}
                  onClick={() => removeTag(tag)}
                >
                  <IconX className='size-3' />
                </button>
              </Badge>
            ))
          )}
        </Flex>

        <Flex direction='row' className='gap-2'>
          <Input
            value={newTag}
            onChange={(event) => setNewTag(event.target.value)}
            placeholder='Add tag'
            maxLength={64}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                addTag();
              }
            }}
          />
          <Button type='button' variant='outline' size='icon' onClick={addTag} aria-label='Add tag'>
            <IconPlus className='size-4' />
          </Button>
        </Flex>
      </Flex>
    </div>
  );
}
