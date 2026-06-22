'use client';

import { IconBuildingStore, IconRobot, IconSend, IconSparkles, IconUser } from '@tabler/icons-react';
import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { Typography } from '@/components/ui/typography';
import { formatPrice } from '@/domains/home/lib/home-utils';
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

const QUICK_PROMPTS = [
  'Is this in stock?',
  'What is the return policy?',
  'Any discounts available?',
  'How long does shipping take?'
] as const;

function createSeedMessages(product: DtoProductWithLike): ChatMessage[] {
  const productName = product.name ?? 'this product';
  const messages: ChatMessage[] = [
    {
      id: 'assistant-welcome',
      role: 'assistant',
      content: `Hi! I'm your Luxe shopping assistant. Ask me anything about ${productName} — sizing, materials, shipping, or alternatives.`
    }
  ];

  if (product.store?.name) {
    messages.push({
      id: 'store-welcome',
      role: 'store',
      content: `You're viewing a listing from ${product.store.name}. I can help you decide if this is the right pick for you.`
    });
  }

  return messages;
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';

  return (
    <Flex
      direction='row'
      align='start'
      spacing={2}
      className={cn('mb-3', isUser ? 'justify-end' : 'justify-start')}
    >
      {!isUser ? (
        <Flex
          align='center'
          justify='center'
          className='bg-gold/15 mt-1 size-8 shrink-0 rounded-full'
        >
          {message.role === 'store' ? (
            <IconBuildingStore className='text-gold-strong size-4' />
          ) : (
            <IconRobot className='text-gold-strong size-4' />
          )}
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
            {message.role === 'store' ? 'Store' : 'Luxe Assistant'}
          </Typography.Overline>
        ) : null}
        <Typography.Text
          variant='small'
          className={cn('leading-relaxed', isUser ? 'text-primary-foreground' : 'text-foreground')}
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
  const numericProductId = Number(product.id ?? 0);
  const { sendMessage, isPending } = useProductAiChat(numericProductId);
  const [messages, setMessages] = useState<ChatMessage[]>(() => createSeedMessages(product));
  const [draft, setDraft] = useState('');
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
    setDraft('');

    const apiMessages = nextMessages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content
      }));

    const reply = await sendMessage(apiMessages);
    appendMessage('assistant', reply);
  };

  return (
    <>
        <SheetHeader className='border-border border-b px-4 py-3'>
          <Flex direction='row' align='center' spacing={3}>
            <Flex
              align='center'
              justify='center'
              className='bg-gold/15 size-9 shrink-0 rounded-full'
            >
              <IconSparkles className='text-gold-strong size-[18px]' />
            </Flex>
            <Flex direction='column' spacing={0} className='min-w-0 flex-1'>
              <SheetTitle className='text-base'>Chat with Luxe</SheetTitle>
              <Typography.Muted className='truncate text-xs'>{product.name}</Typography.Muted>
            </Flex>
          </Flex>
        </SheetHeader>

        <Flex className='border-border/60 bg-muted/20 border-b px-4 py-2'>
          <Typography.Muted className='text-xs'>
            {formatPrice(product.price)}
            {product.store?.name ? ` · ${product.store.name}` : ''}
          </Typography.Muted>
        </Flex>

        <Flex direction='column' className='min-h-0 flex-1 overflow-y-auto px-4 py-4'>
          {messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))}
          {isPending ? (
            <ChatBubble
              message={{
                id: 'assistant-loading',
                role: 'assistant',
                content: 'Thinking…'
              }}
            />
          ) : null}

          <Flex direction='column' spacing={2} className='mt-4'>
            <Typography.Overline className='text-muted-foreground'>Quick questions</Typography.Overline>
            <Flex direction='row' wrap='wrap' spacing={2}>
              {QUICK_PROMPTS.map((prompt) => (
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
              placeholder='Ask about this product…'
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
              aria-label='Send message'
            >
              <IconSend className='size-4' />
            </Button>
          </Flex>
          <Typography.Muted className='text-center text-xs'>
            Answers use product listing facts only
          </Typography.Muted>
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
  return (
    <Button
      type='button'
      onClick={onClick}
      className={cn(
        'bg-gold hover:bg-gold/90 fixed right-6 bottom-6 z-40 gap-2 rounded-full px-5 shadow-lg',
        className
      )}
    >
      <IconSparkles className='size-4' />
      Ask AI
    </Button>
  );
}
