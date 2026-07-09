'use client';

import { IconPlus, IconX } from '@tabler/icons-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/typography';
import type { DtoAdminOrderDetailResponse } from '@/services/-orders-{id}-get.schemas';
import { usePutOrdersIdTags } from '@/services/-orders-{id}-tags-put';

interface OrderTagsCardProps {
  orderId: number;
  tags?: string[];
  onSaved: (order: DtoAdminOrderDetailResponse) => void;
}

function normalizeTag(value: string) {
  return value.trim().toLowerCase();
}

/** Admin tag editor — saves immediately when tags are added or removed. */
export function OrderTagsCard({ orderId, tags = [], onSaved }: OrderTagsCardProps) {
  const [draftTags, setDraftTags] = useState(tags);
  const [newTag, setNewTag] = useState('');
  const { mutateAsync: saveTags, isPending } = usePutOrdersIdTags();

  const persistTags = async (nextTags: string[]) => {
    try {
      const result = await saveTags({ id: orderId, data: { tags: nextTags } });
      const updated = result.data;
      if (updated) {
        onSaved(updated);
        setDraftTags(updated.tags ?? nextTags);
      }
      toast.success('Tags saved');
    } catch (error) {
      toast.error('Could not save tags', {
        description: error instanceof Error ? error.message : 'Something went wrong'
      });
    }
  };

  const addTag = () => {
    const normalized = normalizeTag(newTag);
    if (!normalized || isPending) return;

    if (draftTags.includes(normalized)) {
      setNewTag('');
      return;
    }
    if (draftTags.length >= 20) {
      toast.error('Maximum 20 tags per order');
      return;
    }

    const nextTags = [...draftTags, normalized];
    setDraftTags(nextTags);
    setNewTag('');
    void persistTags(nextTags);
  };

  const removeTag = (tag: string) => {
    if (isPending) return;
    const nextTags = draftTags.filter((item) => item !== tag);
    setDraftTags(nextTags);
    void persistTags(nextTags);
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
        {isPending ? (
          <Text variant='muted' className='text-[10px]'>
            Saving…
          </Text>
        ) : null}
      </Flex>
      <Flex direction='column' spacing={4} className='p-6'>
        <Text variant='muted' className='text-[11px]'>
          Labels for filtering and triage. Also visible in the orders table Tags column.
        </Text>

        <Flex direction='row' wrap='wrap' className='gap-2'>
          {draftTags.length === 0 ? (
            <Text variant='muted' className='text-xs italic'>
              No tags yet — add one below
            </Text>
          ) : (
            draftTags.map((tag) => (
              <Badge key={tag} variant='secondary' className='gap-1 pr-1 text-xs'>
                {tag}
                <button
                  type='button'
                  className='hover:bg-muted rounded-full p-0.5 disabled:opacity-50'
                  aria-label={`Remove tag ${tag}`}
                  disabled={isPending}
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
            placeholder='Add tag (e.g. vip, wholesale)'
            maxLength={64}
            disabled={isPending}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                addTag();
              }
            }}
          />
          <Button
            type='button'
            variant='outline'
            size='icon'
            disabled={isPending || !normalizeTag(newTag)}
            onClick={addTag}
            aria-label='Add tag'
          >
            <IconPlus className='size-4' />
          </Button>
        </Flex>
      </Flex>
    </div>
  );
}
