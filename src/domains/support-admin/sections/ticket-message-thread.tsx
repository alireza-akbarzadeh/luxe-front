'use client';

import { format, parseISO } from 'date-fns';

import { Flex } from '@/components/ui/flex';
import { Text } from '@/components/ui/typography';
import { SupportChannelBadge } from '@/domains/support-admin/components/support-channel-badge';
import type { DtoSupportTicketMessageResponse } from '@/services/-admin-support-tickets-{id}-get.schemas';

interface TicketMessageThreadProps {
  messages?: DtoSupportTicketMessageResponse[];
  channel?: string;
}

function formatMessageDate(value?: string) {
  if (!value) return '';
  const date = parseISO(value);
  if (Number.isNaN(date.getTime())) return '';
  return format(date, 'MMM d · h:mm a');
}

function messageStyles(message: DtoSupportTicketMessageResponse) {
  if (message.is_internal) {
    return 'border-amber-500/30 bg-amber-500/5';
  }
  if (message.author_role === 'staff') {
    return 'border-primary/20 bg-primary/5 ml-8';
  }
  if (message.author_role === 'customer') {
    return 'border-border/60 bg-muted/30 mr-8';
  }
  return 'border-border/60 bg-card';
}

export function TicketMessageThread({ messages = [], channel }: TicketMessageThreadProps) {
  if (messages.length === 0) {
    return (
      <div className='text-muted-foreground rounded-xl border border-dashed p-8 text-center text-sm'>
        No messages yet.
      </div>
    );
  }

  return (
    <Flex direction='column' className='gap-3'>
      {messages.map((message) => (
        <div key={message.id} className={`rounded-2xl border px-4 py-3 ${messageStyles(message)}`}>
          <Flex align='center' justify='between' wrap='wrap' className='mb-2 gap-2'>
            <Flex align='center' className='gap-2'>
              <Text variant='small' className='font-semibold'>
                {message.author_name ?? message.author_role ?? 'Unknown'}
              </Text>
              {message.is_internal ? (
                <span className='rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold tracking-wide text-amber-800 uppercase dark:text-amber-200'>
                  Internal
                </span>
              ) : null}
              {message.is_ai_suggestion ? (
                <span className='rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-bold tracking-wide text-violet-800 uppercase dark:text-violet-200'>
                  AI draft
                </span>
              ) : null}
            </Flex>
            <Flex align='center' className='gap-2'>
              <SupportChannelBadge channel={message.channel ?? channel} />
              <Text variant='muted' className='text-[10px]'>
                {formatMessageDate(message.created_at)}
              </Text>
            </Flex>
          </Flex>
          <Text variant='small' className='leading-relaxed whitespace-pre-wrap'>
            {message.body}
          </Text>
        </div>
      ))}
    </Flex>
  );
}
