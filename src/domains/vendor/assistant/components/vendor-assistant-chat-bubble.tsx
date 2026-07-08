'use client';

import { IconRobot, IconUser } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { Message, MessageContent, MessageLabel, MessageResponse } from '@/components/ai/message';
import { Flex } from '@/components/ui/flex';
import { cn } from '@/lib/utils';

import type { VendorAssistantChatMessage } from '../types/vendor-assistant.types';

function AssistantAvatar() {
  return (
    <Flex align='center' justify='center' className='bg-gold/15 mt-1 size-8 shrink-0 rounded-full'>
      <IconRobot className='text-gold-strong size-4' />
    </Flex>
  );
}

function UserAvatar() {
  return (
    <Flex align='center' justify='center' className='bg-muted mt-1 size-8 shrink-0 rounded-full'>
      <IconUser className='size-4' />
    </Flex>
  );
}

export function VendorAssistantChatBubble({ message }: { message: VendorAssistantChatMessage }) {
  const t = useTranslations('vendorAssistant');
  const isUser = message.role === 'user';

  return (
    <Flex
      direction='column'
      spacing={2}
      className={cn('mb-3 w-full', isUser ? 'items-end' : 'items-start')}
    >
      <Flex
        direction='row'
        align='start'
        spacing={2}
        className={cn('w-full', isUser ? 'justify-end' : 'justify-start')}
      >
        {!isUser ? <AssistantAvatar /> : null}

        <Message from={message.role} className='max-w-[82%]'>
          <MessageContent>
            {!isUser ? <MessageLabel>{t('assistant')}</MessageLabel> : null}
            <MessageResponse>{message.content}</MessageResponse>
          </MessageContent>
        </Message>

        {isUser ? <UserAvatar /> : null}
      </Flex>
    </Flex>
  );
}

export { AssistantAvatar };
