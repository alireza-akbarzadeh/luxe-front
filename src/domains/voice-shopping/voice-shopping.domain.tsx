'use client';

import { IconMicrophone, IconSparkles } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

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
import { Typography } from '@/components/ui/typography';
import {
  AssistantAvatar,
  ShoppingAssistantChatBubble
} from '@/domains/shopping-assistant/components/shopping-assistant-chat-bubble';
import { VoiceWaveform } from '@/domains/shopping-assistant/components/voice-waveform';
import { useShoppingAssistantConversation } from '@/domains/shopping-assistant/hooks/use-shopping-assistant-conversation';
import { cn } from '@/lib/utils';

type VoiceShoppingDomainProps = {
  autoStartVoice?: boolean;
};

export default function VoiceShoppingDomain({ autoStartVoice = false }: VoiceShoppingDomainProps) {
  const t = useTranslations('voiceShoppingPage');
  const tAssistant = useTranslations('shoppingAssistant');
  const [voiceAutoStart, setVoiceAutoStart] = useState(autoStartVoice);

  const { messages, isPending, chipPrompts, chipLabel, handleSend, handleSuggestionClick } =
    useShoppingAssistantConversation({
      welcomeMessage: t('welcome')
    });

  const handlePromptSubmit = async ({ text }: PromptInputMessage) => {
    const trimmed = text.trim();
    if (!trimmed || isPending) {
      throw new Error('empty');
    }
    await handleSend(trimmed);
  };

  return (
    <Flex direction='column' className='min-h-[calc(100dvh-4rem)]'>
      <Flex
        direction='column'
        align='center'
        spacing={3}
        className='from-secondary/40 to-background border-border border-b bg-linear-to-b px-4 py-8 text-center'
      >
        <Flex
          align='center'
          justify='center'
          className='bg-gold/15 size-16 rounded-full shadow-inner'
          aria-hidden
        >
          <IconMicrophone className='text-gold-strong size-8' />
        </Flex>
        <Flex direction='column' spacing={1} align='center'>
          <Typography.H1 className='text-2xl md:text-3xl'>{t('title')}</Typography.H1>
          <Typography.Muted className='max-w-lg text-sm md:text-base'>
            {t('subtitle')}
          </Typography.Muted>
        </Flex>
        <Flex direction='row' align='center' spacing={2} className='text-accent'>
          <VoiceWaveform active barClassName='bg-accent' />
          <Typography.Small className='text-accent font-medium'>
            {t('speakNaturally')}
          </Typography.Small>
        </Flex>
      </Flex>

      <Conversation className='min-h-0 flex-1'>
        <ConversationContent className='app-container max-w-3xl gap-0 px-4 py-6'>
          {messages.map((message) => (
            <ShoppingAssistantChatBubble key={message.id} message={message} />
          ))}
          {isPending ? (
            <AiThinkingRow avatar={<AssistantAvatar />} label={tAssistant('thinking')} />
          ) : null}

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

      <Flex
        direction='column'
        spacing={2}
        className='border-border bg-background/95 sticky bottom-0 border-t px-4 py-4 backdrop-blur-sm'
      >
        <Flex
          direction='row'
          align='center'
          spacing={2}
          className='text-muted-foreground justify-center'
        >
          <IconSparkles className='size-4' aria-hidden />
          <Typography.Muted className='text-xs'>{t('composerHint')}</Typography.Muted>
        </Flex>
        <div className='app-container mx-auto w-full max-w-3xl'>
          <VoiceAiChatComposer
            isPending={isPending}
            onSubmit={handlePromptSubmit}
            placeholder={t('placeholder')}
            autoStartVoice={voiceAutoStart}
            onAutoStartConsumed={() => setVoiceAutoStart(false)}
          />
        </div>
        <Typography.Muted className={cn('text-center text-xs')}>
          {tAssistant('footer')}
        </Typography.Muted>
      </Flex>
    </Flex>
  );
}
