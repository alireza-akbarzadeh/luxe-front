'use client';

import { IconBuildingStore, IconRobot, IconSparkles, IconUser } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';

import { AiChatComposer } from '@/components/ai/ai-chat-composer';
import { AiThinkingRow } from '@/components/ai/ai-thinking-row';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton
} from '@/components/ai/conversation';
import { Message, MessageContent, MessageLabel, MessageResponse } from '@/components/ai/message';
import { type PromptInputMessage } from '@/components/ai/prompt-input';
import { Suggestion, Suggestions } from '@/components/ai/suggestion';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Typography } from '@/components/ui/typography';
import { useLocaleFormatters } from '@/lib/i18n/use-locale-formatters';
import { cn } from '@/lib/utils';
import type { DtoProductWithLike } from '@/services/-products-get.schemas';

import { useProductAiChat } from '../hooks/use-product-ai-chat';

interface ProductChatSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: DtoProductWithLike;
}

type ChatRole = 'assistant' | 'store' | 'user';

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

const QUICK_PROMPT_KEYS = [
  'promptStock',
  'promptReturns',
  'promptDiscounts',
  'promptShipping'
] as const;

function AssistantAvatar() {
  return (
    <Flex align='center' justify='center' className='bg-gold/15 mt-1 size-8 shrink-0 rounded-full'>
      <IconRobot className='text-gold-strong size-4' />
    </Flex>
  );
}

function StoreAvatar() {
  return (
    <Flex align='center' justify='center' className='bg-gold/15 mt-1 size-8 shrink-0 rounded-full'>
      <IconBuildingStore className='text-gold-strong size-4' />
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

function ChatBubble({ message }: { message: ChatMessage }) {
  const t = useTranslations('pdp.chat');
  const isUser = message.role === 'user';
  const messageRole = message.role === 'store' ? 'store' : message.role;

  return (
    <Flex
      direction='row'
      align='start'
      spacing={2}
      className={cn('mb-3 w-full', isUser ? 'justify-end' : 'justify-start')}
    >
      {!isUser ? message.role === 'store' ? <StoreAvatar /> : <AssistantAvatar /> : null}

      <Message from={isUser ? 'user' : 'assistant'} className='max-w-[82%]'>
        <MessageContent>
          {!isUser ? (
            <MessageLabel>{messageRole === 'store' ? t('store') : t('assistant')}</MessageLabel>
          ) : null}
          <MessageResponse>{message.content}</MessageResponse>
        </MessageContent>
      </Message>

      {isUser ? <UserAvatar /> : null}
    </Flex>
  );
}

export function ProductChatSheet({ open, onOpenChange, product }: ProductChatSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side='right' className='flex w-full flex-col gap-0 p-0 sm:max-w-md'>
        {open ? <ProductChatPanel key={String(product.id ?? '')} product={product} /> : null}
      </SheetContent>
    </Sheet>
  );
}

function ProductChatPanel({ product }: { product: DtoProductWithLike }) {
  const t = useTranslations('pdp.chat');
  const tPdp = useTranslations('pdp');
  const { formatPrice, moneyClassName } = useLocaleFormatters();
  const numericProductId = Number(product.id ?? 0);
  const { sendMessage, isPending } = useProductAiChat(numericProductId);

  const buildSeedMessages = (): ChatMessage[] => {
    const productName = product.name ?? tPdp('thisProduct');
    const messages: ChatMessage[] = [
      {
        id: 'assistant-welcome',
        role: 'assistant',
        content: t('welcomeAssistant', { name: productName })
      }
    ];

    if (product.store?.name) {
      messages.push({
        id: 'store-welcome',
        role: 'store',
        content: t('welcomeStore', { store: product.store.name })
      });
    }

    return messages;
  };

  const [messages, setMessages] = useState<ChatMessage[]>(buildSeedMessages);
  const messageIdRef = useRef(0);

  const nextMessageId = (role: ChatRole) => {
    messageIdRef.current += 1;
    return `${role}-${messageIdRef.current}`;
  };

  const appendMessage = (role: ChatRole, content: string) => {
    setMessages((current) => [...current, { id: nextMessageId(role), role, content }]);
  };

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isPending) {
      return;
    }

    const userMessage: ChatMessage = {
      id: nextMessageId('user'),
      role: 'user',
      content: trimmed
    };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);

    const apiMessages = nextMessages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content
      }));

    const reply = await sendMessage(apiMessages);
    appendMessage('assistant', reply);
  };

  const handlePromptSubmit = async ({ text }: PromptInputMessage) => {
    const trimmed = text.trim();
    if (!trimmed || isPending) {
      throw new Error('empty');
    }
    await handleSend(trimmed);
  };

  const handleSuggestionClick = (prompt: string) => {
    void handleSend(prompt);
  };

  return (
    <>
      <SheetHeader className='border-border border-b px-4 py-3'>
        <Flex direction='row' align='center' spacing={3}>
          <Flex align='center' justify='center' className='bg-gold/15 size-9 shrink-0 rounded-full'>
            <IconSparkles className='text-gold-strong size-[18px]' />
          </Flex>
          <Flex direction='column' spacing={0} className='min-w-0 flex-1'>
            <SheetTitle className='text-base'>{t('title')}</SheetTitle>
            <Typography.Muted className='truncate text-xs'>{product.name}</Typography.Muted>
          </Flex>
        </Flex>
      </SheetHeader>

      <Flex className='border-border/60 bg-muted/20 border-b px-4 py-2'>
        <Typography.Muted className={cn('text-xs', moneyClassName)}>
          {formatPrice(product.price)}
          {product.store?.name ? ` · ${product.store.name}` : ''}
        </Typography.Muted>
      </Flex>

      <Conversation className='min-h-0 flex-1'>
        <ConversationContent className='gap-0 px-4 py-4'>
          {messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))}
          {isPending ? <AiThinkingRow avatar={<AssistantAvatar />} label={t('thinking')} /> : null}

          <Flex direction='column' spacing={2} className='mt-4'>
            <Typography.Overline className='text-muted-foreground'>
              {t('quickQuestions')}
            </Typography.Overline>
            <Suggestions>
              {QUICK_PROMPT_KEYS.map((key) => (
                <Suggestion
                  key={key}
                  disabled={isPending}
                  onClick={handleSuggestionClick}
                  suggestion={t(key)}
                />
              ))}
            </Suggestions>
          </Flex>
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <Flex direction='column' spacing={2} className='border-border border-t px-4 py-3'>
        <AiChatComposer
          isPending={isPending}
          onSubmit={handlePromptSubmit}
          placeholder={t('placeholder')}
        />
        <Typography.Muted className='text-center text-xs'>{t('footer')}</Typography.Muted>
      </Flex>
    </>
  );
}

/** Floating PDP entry point for the product chat sheet. */
export function ProductChatFab({
  onClick,
  className
}: {
  onClick: () => void;
  className?: string;
}) {
  const t = useTranslations('pdp.chat');

  return (
    <Button
      type='button'
      onClick={onClick}
      className={cn(
        'bg-gold hover:bg-gold/90 hidden gap-2 rounded-full px-5 shadow-lg lg:fixed lg:end-6 lg:bottom-6 lg:inline-flex',
        className
      )}
    >
      <IconSparkles className='size-5' />
      {t('fab')}
    </Button>
  );
}
