'use client';

import { IconRobot, IconSend, IconSparkles, IconUser } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import type { DtoAiRecommendedProduct } from '@/services/-ai-shopping-assistant-post.schemas';

import { useShoppingAssistant } from '../hooks/use-shopping-assistant';
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

function ChatBubble({ message }: { message: ChatMessage }) {
  const t = useTranslations('shoppingAssistant');
  const isUser = message.role === 'user';

  return (
    <Flex
      direction='column'
      spacing={2}
      className={cn('mb-3', isUser ? 'items-end' : 'items-start')}
    >
      <Flex
        direction='row'
        align='start'
        spacing={2}
        className={cn('w-full', isUser ? 'justify-end' : 'justify-start')}
      >
        {!isUser ? (
          <Flex
            align='center'
            justify='center'
            className='bg-gold/15 mt-1 size-8 shrink-0 rounded-full'
          >
            <IconRobot className='text-gold-strong size-4' />
          </Flex>
        ) : null}

        <Flex
          direction='column'
          spacing={1}
          className={cn(
            'max-w-[82%] rounded-2xl px-4 py-3',
            isUser ? 'bg-gold rounded-br-md' : 'bg-card border-border rounded-bl-md border'
          )}
        >
          {!isUser ? (
            <Typography.Overline className='text-muted-foreground mb-1 block'>
              {t('assistant')}
            </Typography.Overline>
          ) : null}
          <Typography.Text
            variant='small'
            className={cn(
              'leading-relaxed',
              isUser ? 'text-primary-foreground' : 'text-foreground'
            )}
          >
            {message.content}
          </Typography.Text>
        </Flex>

        {isUser ? (
          <Flex
            align='center'
            justify='center'
            className='bg-muted mt-1 size-8 shrink-0 rounded-full'
          >
            <IconUser className='size-4' />
          </Flex>
        ) : null}
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
  const [draft, setDraft] = useState('');
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
    setDraft('');
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

      <Flex direction='column' className='min-h-0 flex-1 overflow-y-auto px-4 py-4'>
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}
        {isPending ? (
          <ChatBubble
            message={{
              id: 'assistant-loading',
              role: 'assistant',
              content: t('thinking')
            }}
          />
        ) : null}

        <Flex direction='column' spacing={2} className='mt-2'>
          <Typography.Overline className='text-muted-foreground'>{chipLabel}</Typography.Overline>
          <Flex direction='row' wrap='wrap' spacing={2}>
            {chipPrompts.map((prompt) => (
              <Button
                key={prompt}
                type='button'
                variant='outline'
                size='sm'
                className='h-auto rounded-full px-3 py-2 text-xs'
                onClick={() => void handleSend(prompt)}
                disabled={isPending}
              >
                {prompt}
              </Button>
            ))}
          </Flex>
        </Flex>
      </Flex>

      <Flex direction='column' spacing={2} className='border-border border-t px-4 py-3'>
        <Flex direction='row' align='end' spacing={2}>
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={t('placeholder')}
            rows={2}
            className='max-h-28 min-h-12 flex-1 resize-none rounded-2xl'
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                void handleSend(draft);
              }
            }}
          />
          <Button
            type='button'
            size='icon'
            className='size-12 shrink-0 rounded-2xl'
            disabled={!draft.trim() || isPending}
            onClick={() => void handleSend(draft)}
            aria-label={t('sendMessage')}
          >
            <IconSend className='cn-rtl-flip size-4' />
          </Button>
        </Flex>
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
