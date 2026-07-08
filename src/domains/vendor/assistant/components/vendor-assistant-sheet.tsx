'use client';

import { IconSparkles } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { AiThinkingRow } from '@/components/ai/ai-thinking-row';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton
} from '@/components/ai/conversation';
import { type PromptInputMessage } from '@/components/ai/prompt-input';
import { Suggestion, Suggestions } from '@/components/ai/suggestion';
import { VoiceAiChatComposer } from '@/components/ai/voice-ai-chat-composer';
import { Flex } from '@/components/ui/flex';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Typography } from '@/components/ui/typography';

import { useVendorAssistantConversation } from '../hooks/use-vendor-assistant-conversation';
import { useVendorAssistantStore } from '../store/vendor-assistant.store';
import type { VendorAssistantVariant } from '../types/vendor-assistant.types';
import { AssistantAvatar, VendorAssistantChatBubble } from './vendor-assistant-chat-bubble';

interface VendorAssistantSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant: VendorAssistantVariant;
}

export function VendorAssistantSheet({ open, onOpenChange, variant }: VendorAssistantSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side='right' className='flex w-full flex-col gap-0 p-0 sm:max-w-md'>
        {open ? <VendorAssistantPanel key={`${variant}-${open}`} variant={variant} /> : null}
      </SheetContent>
    </Sheet>
  );
}

function VendorAssistantPanel({ variant }: { variant: VendorAssistantVariant }) {
  const t = useTranslations('vendorAssistant');
  const tVoice = useTranslations('shoppingAssistant.voice');
  const closeAssistant = useVendorAssistantStore((s) => s.close);
  const { messages, isPending, chipPrompts, chipLabel, handleSend, handleSuggestionClick } =
    useVendorAssistantConversation({ variant, onNavigateAway: closeAssistant });

  const handlePromptSubmit = async ({ text, files }: PromptInputMessage) => {
    const trimmed = text.trim();
    if (files.length > 0) {
      toast.message(tVoice('attachmentsPending'), {
        description: tVoice('attachmentsPendingHint')
      });
    }
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
            <IconSparkles className='text-gold-strong size-4.5' />
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
            <VendorAssistantChatBubble key={message.id} message={message} />
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
