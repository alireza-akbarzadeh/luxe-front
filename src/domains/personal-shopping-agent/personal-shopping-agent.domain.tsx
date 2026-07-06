'use client';

import { IconRobot, IconSparkles } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';

import { AiThinkingRow } from '@/components/ai/ai-thinking-row';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton
} from '@/components/ai/conversation';
import { type PromptInputMessage } from '@/components/ai/prompt-input';
import { Suggestion, Suggestions } from '@/components/ai/suggestion';
import { VoiceAiChatComposer } from '@/components/ai/voice-ai-chat-composer';
import { DynamicBreadcrumb } from '@/components/breadcrumb-list';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import {
  AssistantAvatar,
  ShoppingAssistantChatBubble
} from '@/domains/shopping-assistant/components/shopping-assistant-chat-bubble';
import type { ShoppingAssistantChatMessage } from '@/domains/shopping-assistant/hooks/use-shopping-assistant-conversation';
import {
  type AiPersonalShoppingAgentResponse,
  postAiPersonalShoppingAgent
} from '@/lib/api/ai-premium';
import { usePrivateShoppingStore } from '@/stores/private-shopping-store';

/** Authenticated personal shopping agent with taste memory context. */
export function PersonalShoppingAgentDomain() {
  const t = useTranslations('personalShoppingAgent');
  const tAssistant = useTranslations('shoppingAssistant');
  const { isAuthenticated } = useAuth();
  const privateMode = usePrivateShoppingStore((s) => s.enabled);
  const messageIdRef = useRef(0);
  const [messages, setMessages] = useState<ShoppingAssistantChatMessage[]>([
    { id: 'welcome', role: 'assistant', content: t('welcome') }
  ]);
  const [memorySummary, setMemorySummary] = useState<string | null>(null);
  const [tasteSignals, setTasteSignals] = useState<string[]>([]);
  const [followUps, setFollowUps] = useState<string[]>([]);
  const [isPending, setIsPending] = useState(false);

  const nextId = (role: 'user' | 'assistant') => {
    messageIdRef.current += 1;
    return `${role}-${messageIdRef.current}`;
  };

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isPending) {
      return;
    }

    const userMessage: ShoppingAssistantChatMessage = {
      id: nextId('user'),
      role: 'user',
      content: trimmed
    };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setFollowUps([]);
    setIsPending(true);

    try {
      const apiMessages = nextMessages
        .filter((m) => m.id !== 'welcome' || m.role === 'user')
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await postAiPersonalShoppingAgent({ messages: apiMessages });
      const data: AiPersonalShoppingAgentResponse | undefined = response.data;

      if (!data?.reply) {
        setMessages((current) => [
          ...current,
          { id: nextId('assistant'), role: 'assistant', content: t('offline') }
        ]);
        return;
      }

      if (data.memory_summary && !privateMode) {
        setMemorySummary(data.memory_summary);
      }
      if (data.taste_signals && !privateMode) {
        setTasteSignals(data.taste_signals);
      }

      setMessages((current) => [
        ...current,
        {
          id: nextId('assistant'),
          role: 'assistant',
          content: data.reply ?? '',
          recommendations: data.recommendations,
          followUpQuestions: data.follow_up_questions
        }
      ]);
      setFollowUps(data.follow_up_questions ?? []);
    } catch {
      setMessages((current) => [
        ...current,
        { id: nextId('assistant'), role: 'assistant', content: t('offline') }
      ]);
    } finally {
      setIsPending(false);
    }
  };

  const handlePromptSubmit = async ({ text }: PromptInputMessage) => {
    const trimmed = text.trim();
    if (!trimmed || isPending) {
      throw new Error('empty');
    }
    await handleSend(trimmed);
  };

  if (!isAuthenticated) {
    return (
      <main className='app-container py-16'>
        <Flex
          direction='column'
          align='center'
          spacing={4}
          className='mx-auto max-w-lg text-center'
        >
          <IconRobot className='text-gold-strong size-10' />
          <Typography.H1 className='text-2xl font-semibold'>{t('title')}</Typography.H1>
          <Typography.Muted>{t('signInPrompt')}</Typography.Muted>
          <Button asChild>
            <Link href='/login?redirect=/shopping-agent'>{t('signIn')}</Link>
          </Button>
        </Flex>
      </main>
    );
  }

  return (
    <Flex direction='column' className='min-h-[calc(100dvh-4rem)]'>
      <Flex direction='column' spacing={3} className='border-border border-b px-4 py-8 text-center'>
        <DynamicBreadcrumb items={[{ label: t('title'), href: '/shopping-agent' }]} />
        <IconSparkles className='text-gold-strong mx-auto size-8' />
        <Typography.H1 className='text-2xl font-semibold md:text-3xl'>{t('title')}</Typography.H1>
        <Typography.Muted className='mx-auto max-w-xl'>{t('subtitle')}</Typography.Muted>
        {privateMode ? (
          <Typography.Muted className='text-sm text-amber-700 dark:text-amber-400'>
            {t('privateModeHint')}
          </Typography.Muted>
        ) : memorySummary ? (
          <Card className='bg-muted/30 mx-auto max-w-2xl rounded-xl border-dashed p-4 text-start'>
            <Typography.Overline className='text-muted-foreground mb-2'>
              {t('memoryTitle')}
            </Typography.Overline>
            <Typography.Small>{memorySummary}</Typography.Small>
            {tasteSignals.length > 0 ? (
              <Flex direction='row' wrap='wrap' spacing={2} className='mt-3'>
                {tasteSignals.map((signal) => (
                  <span
                    key={signal}
                    className='bg-background text-muted-foreground rounded-full border px-3 py-1 text-xs'
                  >
                    {signal}
                  </span>
                ))}
              </Flex>
            ) : null}
          </Card>
        ) : null}
      </Flex>

      <Conversation className='min-h-0 flex-1'>
        <ConversationContent className='app-container max-w-3xl gap-0 px-4 py-6'>
          {messages.map((message) => (
            <ShoppingAssistantChatBubble key={message.id} message={message} />
          ))}
          {isPending ? (
            <AiThinkingRow avatar={<AssistantAvatar />} label={tAssistant('thinking')} />
          ) : null}
          {followUps.length > 0 ? (
            <Flex direction='column' spacing={2} className='mt-2'>
              <Typography.Overline className='text-muted-foreground'>
                {tAssistant('followUpQuestions')}
              </Typography.Overline>
              <Suggestions>
                {followUps.map((prompt) => (
                  <Suggestion
                    key={prompt}
                    disabled={isPending}
                    onClick={handleSend}
                    suggestion={prompt}
                  />
                ))}
              </Suggestions>
            </Flex>
          ) : null}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <Flex
        direction='column'
        spacing={2}
        className='border-border bg-background/95 sticky bottom-0 border-t px-4 py-4 backdrop-blur-sm'
      >
        <div className='app-container mx-auto w-full max-w-3xl'>
          <VoiceAiChatComposer
            isPending={isPending}
            onSubmit={handlePromptSubmit}
            placeholder={t('placeholder')}
          />
        </div>
      </Flex>
    </Flex>
  );
}
