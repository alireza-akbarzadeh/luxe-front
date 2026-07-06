'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';

import { PERSONALIZATION_ROUTES } from '@/domains/personalization/lib/personalization-routes';
import type { DtoAiRecommendedProduct } from '@/services/-ai-shopping-assistant-post.schemas';

import { useShoppingAssistant } from './use-shopping-assistant';

export type ChatRole = 'assistant' | 'user';

export interface ShoppingAssistantChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  recommendations?: DtoAiRecommendedProduct[];
  followUpQuestions?: string[];
}

const QUICK_SEND_KEYS = ['promptHome', 'promptTrending'] as const;

const QUICK_ROUTE_ACTIONS = [
  { key: 'promptGift', href: '/gift-cards/finder' },
  { key: 'promptGoal', href: PERSONALIZATION_ROUTES.goal },
  { key: 'promptMood', href: PERSONALIZATION_ROUTES.mood },
  { key: 'promptMemory', href: PERSONALIZATION_ROUTES.memory }
] as const;

type UseShoppingAssistantConversationOptions = {
  welcomeMessage?: string;
  onNavigateAway?: () => void;
};

/** Shared chat state + send handler for shopping assistant UIs. */
export function useShoppingAssistantConversation({
  welcomeMessage,
  onNavigateAway
}: UseShoppingAssistantConversationOptions = {}) {
  const t = useTranslations('shoppingAssistant');
  const router = useRouter();
  const { sendTurn, isPending, offlineReply } = useShoppingAssistant();
  const messageIdRef = useRef(0);

  const nextMessageId = (role: ChatRole) => {
    messageIdRef.current += 1;
    return `${role}-${messageIdRef.current}`;
  };

  const [messages, setMessages] = useState<ShoppingAssistantChatMessage[]>([
    {
      id: 'assistant-welcome',
      role: 'assistant',
      content: welcomeMessage ?? t('welcome')
    }
  ]);
  const [activeFollowUps, setActiveFollowUps] = useState<string[]>([]);

  const chipPrompts =
    activeFollowUps.length > 0
      ? activeFollowUps
      : [
          ...QUICK_ROUTE_ACTIONS.map((action) => t(action.key)),
          ...QUICK_SEND_KEYS.map((key) => t(key))
        ];
  const chipLabel = activeFollowUps.length > 0 ? t('followUpQuestions') : t('quickPrompts');

  const appendMessage = (message: Omit<ShoppingAssistantChatMessage, 'id'> & { id?: string }) => {
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

    const userMessage: ShoppingAssistantChatMessage = {
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

  const handleQuickPrompt = (label: string) => {
    const routeAction = QUICK_ROUTE_ACTIONS.find((action) => t(action.key) === label);
    if (routeAction) {
      onNavigateAway?.();
      router.push(routeAction.href);
      return;
    }

    const sendKey = QUICK_SEND_KEYS.find((key) => t(key) === label);
    if (sendKey) {
      void handleSend(label);
    }
  };

  const handleSuggestionClick = (prompt: string) => {
    if (activeFollowUps.length > 0) {
      void handleSend(prompt);
      return;
    }

    handleQuickPrompt(prompt);
  };

  return {
    messages,
    isPending,
    chipPrompts,
    chipLabel,
    handleSend,
    handleSuggestionClick
  };
}
