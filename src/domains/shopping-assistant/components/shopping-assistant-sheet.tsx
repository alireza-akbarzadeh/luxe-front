'use client';

import { IconRobot, IconSparkles, IconUser } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
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
import { cn } from '@/lib/utils';
import type { DtoAiRecommendedProduct } from '@/services/-ai-shopping-assistant-post.schemas';

import { useShoppingAssistant } from '../hooks/use-shopping-assistant';
import { useShoppingAssistantStore } from '../store/shopping-assistant.store';
import { ShoppingAssistantRecommendationCard } from './shopping-assistant-recommendation-card';

type ChatRole = 'assistant' | 'user';

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  recommendations?: DtoAiRecommendedProduct[];
  followUpQuestions?: string[];
}

const QUICK_PROMPT_KEYS = ['promptGift', 'promptHome', 'promptTrending'] as const;

interface ShoppingAssistantSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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

function ChatBubble({ message }: { message: ChatMessage }) {
  const t = useTranslations('shoppingAssistant');
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

      {!isUser && message.recommendations && message.recommendations.length > 0 ? (
        <Flex direction='column' spacing={2} className='w-full ps-10'>
          <Typography.Overline className='text-muted-foreground'>
            {t('picksForYou')}
          </Typography.Overline>
          {message.recommendations.map((item, index) => (
            <ShoppingAssistantRecommendationCard
              key={String(item.product?.id ?? index)}
              item={item}
            />
          ))}
        </Flex>
      ) : null}
    </Flex>
  );
}

export function ShoppingAssistantSheet({ open, onOpenChange }: ShoppingAssistantSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side='right' className='flex w-full flex-col gap-0 p-0 sm:max-w-md'>
        {open ? <ShoppingAssistantPanel key={open ? 'open' : 'closed'} /> : null}
      </SheetContent>
    </Sheet>
  );
}

function ShoppingAssistantPanel() {
  const t = useTranslations('shoppingAssistant');
  const router = useRouter();
  const closeAssistant = useShoppingAssistantStore((s) => s.close);
  const { sendTurn, isPending, offlineReply } = useShoppingAssistant();
  const messageIdRef = useRef(0);

  const nextMessageId = (role: ChatRole) => {
    messageIdRef.current += 1;
    return `${role}-${messageIdRef.current}`;
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'assistant-welcome',
      role: 'assistant',
      content: t('welcome')
    }
  ]);
  const [activeFollowUps, setActiveFollowUps] = useState<string[]>([]);

  const chipPrompts =
    activeFollowUps.length > 0 ? activeFollowUps : QUICK_PROMPT_KEYS.map((key) => t(key));
  const chipLabel = activeFollowUps.length > 0 ? t('followUpQuestions') : t('quickPrompts');

  const appendMessage = (message: Omit<ChatMessage, 'id'> & { id?: string }) => {
    setMessages((current) => [
      ...current,
      { ...message, id: message.id ?? nextMessageId(message.role) }
    ]);
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
    setActiveFollowUps([]);

    const apiMessages = nextMessages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({
        role: m.role,
        content: m.content
      }));

    const result = await sendTurn(apiMessages);
    if (!result) {
      appendMessage({ role: 'assistant', content: offlineReply });
      return;
    }

    appendMessage({
      role: 'assistant',
      content: result.reply?.trim() || offlineReply,
      recommendations: result.recommendations,
      followUpQuestions: result.follow_up_questions
    });
    setActiveFollowUps(result.follow_up_questions ?? []);
  };

  const handlePromptSubmit = async ({ text }: PromptInputMessage) => {
    const trimmed = text.trim();
    if (!trimmed || isPending) {
      throw new Error('empty');
    }
    await handleSend(trimmed);
  };

  const handleQuickPrompt = (promptKey: (typeof QUICK_PROMPT_KEYS)[number], label: string) => {
    if (promptKey === 'promptGift') {
      closeAssistant();
      router.push('/gift-cards/finder');
      return;
    }
    void handleSend(label);
  };

  const handleSuggestionClick = (prompt: string) => {
    const key = QUICK_PROMPT_KEYS.find((k) => t(k) === prompt);
    if (key) {
      handleQuickPrompt(key, prompt);
      return;
    }
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
            <Typography.Muted className='text-xs'>{t('subtitle')}</Typography.Muted>
          </Flex>
        </Flex>
      </SheetHeader>

      <Conversation className='min-h-0 flex-1'>
        <ConversationContent className='gap-0 px-4 py-4'>
          {messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))}
          {isPending ? <AiThinkingRow avatar={<AssistantAvatar />} label={t('thinking')} /> : null}

          <Flex direction='column' spacing={2} className='mt-2'>
            <Typography.Overline className='text-muted-foreground'>{chipLabel}</Typography.Overline>
            <Suggestions>
              {chipPrompts.map((prompt) => (
                <Suggestion
                  key={prompt}
                  disabled={isPending}
                  onClick={handleSuggestionClick}
                  suggestion={prompt}
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

/** Floating site-wide entry point for the shopping assistant. */
export function ShoppingAssistantFab({
  onClick,
  className
}: {
  onClick: () => void;
  className?: string;
}) {
  const t = useTranslations('shoppingAssistant');

  return (
    <Button
      type='button'
      onClick={onClick}
      className={cn(
        'bg-gold hover:bg-gold/90 fixed start-6 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-40 gap-2 rounded-full px-5 shadow-lg lg:bottom-6',
        className
      )}
    >
      <IconSparkles className='size-5' />
      <span className='hidden sm:inline'>{t('fab')}</span>
      <span className='sr-only sm:hidden'>{t('fab')}</span>
    </Button>
  );
}
