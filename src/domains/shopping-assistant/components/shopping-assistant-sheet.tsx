'use client';

import { IconSparkles } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { AiThinkingRow } from '@/components/ai/ai-thinking-row';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton
} from '@/components/ai/conversation';
import { type PromptInputMessage } from '@/components/ai/prompt-input';
import { Suggestion, Suggestions } from '@/components/ai/suggestion';
import { VoiceAiChatComposer } from '@/components/ai/voice-ai-chat-composer';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

import { useShoppingAssistantConversation } from '../hooks/use-shopping-assistant-conversation';
import { useShoppingAssistantStore } from '../store/shopping-assistant.store';
import { AssistantAvatar, ShoppingAssistantChatBubble } from './shopping-assistant-chat-bubble';

interface ShoppingAssistantSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
  const closeAssistant = useShoppingAssistantStore((s) => s.close);
  const { messages, isPending, chipPrompts, chipLabel, handleSend, handleSuggestionClick } =
    useShoppingAssistantConversation({ onNavigateAway: closeAssistant });

  const handlePromptSubmit = async ({ text }: PromptInputMessage) => {
    const trimmed = text.trim();
    if (!trimmed || isPending) {
      throw new Error('empty');
    }
    await handleSend(trimmed);
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
            <ShoppingAssistantChatBubble key={message.id} message={message} />
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
        <VoiceAiChatComposer
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
