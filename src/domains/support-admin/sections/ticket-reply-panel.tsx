'use client';

import { IconSparkles } from '@tabler/icons-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Flex } from '@/components/ui/flex';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Text } from '@/components/ui/typography';
import type { DtoSupportTicketResponse } from '@/services/-admin-support-tickets-{id}-get.schemas';
import { usePostAdminSupportTicketsIdMessages } from '@/services/-admin-support-tickets-{id}-messages-post';
import { DtoCreateSupportTicketMessageRequestChannel } from '@/services/-admin-support-tickets-{id}-messages-post.schemas';
import { usePostAdminSupportTicketsIdSuggestReply } from '@/services/-admin-support-tickets-{id}-suggest-reply-post';

interface TicketReplyPanelProps {
  ticket: DtoSupportTicketResponse;
  onUpdated: (ticket: DtoSupportTicketResponse) => void;
}

export function TicketReplyPanel({ ticket, onUpdated }: TicketReplyPanelProps) {
  const ticketId = ticket.id!;
  const [body, setBody] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [replyChannel, setReplyChannel] = useState<DtoCreateSupportTicketMessageRequestChannel>(
    (ticket.channel as DtoCreateSupportTicketMessageRequestChannel) ??
      DtoCreateSupportTicketMessageRequestChannel.email
  );

  const { mutateAsync: sendMessage, isPending: isSending } = usePostAdminSupportTicketsIdMessages();
  const { mutateAsync: suggestReply, isPending: isSuggesting } =
    usePostAdminSupportTicketsIdSuggestReply();

  const handleSuggest = async () => {
    try {
      const result = await suggestReply({ id: ticketId });
      const suggestion = result.data?.suggestion;
      if (suggestion) {
        setBody(suggestion);
        setIsInternal(false);
        toast.success('AI draft ready — review before sending');
      }
    } catch (error) {
      toast.error('Could not generate suggestion', {
        description: error instanceof Error ? error.message : 'AI may be unavailable'
      });
    }
  };

  const handleSend = async () => {
    const trimmed = body.trim();
    if (!trimmed) {
      toast.error('Write a message first');
      return;
    }

    try {
      await sendMessage({
        id: ticketId,
        data: {
          body: trimmed,
          channel: isInternal ? DtoCreateSupportTicketMessageRequestChannel.internal : replyChannel,
          is_internal: isInternal
        }
      });
      setBody('');
      toast.success(isInternal ? 'Internal note added' : 'Reply sent');
      onUpdated(ticket);
    } catch (error) {
      toast.error('Could not send message', {
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
        wrap='wrap'
        className='bg-muted/20 border-border/10 gap-3 border-b px-6 py-4'
      >
        <Text variant='overline' className='text-muted-foreground'>
          {isInternal ? 'Internal note' : 'Reply to customer'}
        </Text>
        <Button
          type='button'
          size='sm'
          variant='outline'
          disabled={isSuggesting}
          onClick={() => void handleSuggest()}
        >
          <IconSparkles className='mr-1.5 size-4' />
          {isSuggesting ? 'Drafting…' : 'AI suggest'}
        </Button>
      </Flex>

      <div className='space-y-4 p-6'>
        <Flex align='center' className='gap-3'>
          <Checkbox
            id='internal-note'
            checked={isInternal}
            onCheckedChange={(checked) => setIsInternal(checked === true)}
          />
          <Label htmlFor='internal-note' className='text-sm font-normal'>
            Internal note (not visible to customer)
          </Label>
        </Flex>

        {!isInternal ? (
          <div className='space-y-2'>
            <Label className='text-xs'>Reply channel</Label>
            <Select
              value={replyChannel}
              onValueChange={(value) =>
                setReplyChannel(value as DtoCreateSupportTicketMessageRequestChannel)
              }
            >
              <SelectTrigger className='w-full max-w-xs'>
                <SelectValue placeholder='Channel' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='email'>Email</SelectItem>
                <SelectItem value='chat'>Live chat</SelectItem>
                <SelectItem value='web'>Web</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : null}

        <Textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder={
            isInternal ? 'Add context for your team…' : 'Write a reply for the customer…'
          }
          rows={5}
          maxLength={4096}
          className='min-h-28 resize-y text-sm'
        />

        <Flex justify='end'>
          <Button type='button' disabled={isSending} onClick={() => void handleSend()}>
            {isSending ? 'Sending…' : isInternal ? 'Add note' : 'Send reply'}
          </Button>
        </Flex>
      </div>
    </div>
  );
}
