'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useMemo, useRef, useState } from 'react';

import { useVendorAiDashboardQuery } from '@/domains/vendor/panel/hooks/use-vendor-ai-dashboard';
import { useVendorPanelStore } from '@/domains/vendor/panel/stores/vendor-panel-store';

import { formatInsightReply } from '../lib/format-vendor-ai-insight';
import { fetchVendorPanelInsight } from '../lib/vendor-assistant-panel-reply';
import type {
  VendorAssistantChatMessage,
  VendorAssistantVariant
} from '../types/vendor-assistant.types';

const LANDING_ROUTE_ACTIONS = [
  { key: 'promptStartSelling', href: '/vendor/apply' },
  { key: 'promptFees', href: '#pricing' },
  { key: 'promptDashboard', href: '#dashboard' }
] as const;

const PANEL_ROUTE_ACTIONS = [{ key: 'promptAnalytics', href: '/vendor/panel/analytics' }] as const;

const LANDING_SEND_KEYS = ['promptContact'] as const;
const PANEL_SEND_KEYS = [
  'promptPriorities',
  'promptPricing',
  'promptInventory',
  'promptSales'
] as const;

type UseVendorAssistantConversationOptions = {
  variant: VendorAssistantVariant;
  onNavigateAway?: () => void;
};

/** Vendor assistant chat state — landing guidance or panel store AI insights. */
export function useVendorAssistantConversation({
  variant,
  onNavigateAway
}: UseVendorAssistantConversationOptions) {
  const t = useTranslations('vendorAssistant');
  const router = useRouter();
  const messageIdRef = useRef(0);
  const activeStoreId = useVendorPanelStore((s) => s.activeStoreId);
  const { data: dashboardData } = useVendorAiDashboardQuery();

  const nextMessageId = (role: VendorAssistantChatMessage['role']) => {
    messageIdRef.current += 1;
    return `${role}-${messageIdRef.current}`;
  };

  const [threadMessages, setThreadMessages] = useState<VendorAssistantChatMessage[]>([]);
  const [isPending, setIsPending] = useState(false);

  const welcomeMessage = useMemo(() => {
    if (variant === 'panel') {
      const briefing = dashboardData?.data;
      if (briefing?.summary) {
        return (
          formatInsightReply({
            summary: briefing.summary,
            priorities: briefing.priorities,
            opportunities: briefing.opportunities,
            alerts: briefing.alerts
          }) || t('welcomePanel')
        );
      }
      return t('welcomePanel');
    }

    return t('welcomeLanding');
  }, [variant, dashboardData?.data, t]);

  const messages = useMemo<VendorAssistantChatMessage[]>(
    () => [
      { id: 'assistant-welcome', role: 'assistant', content: welcomeMessage },
      ...threadMessages
    ],
    [threadMessages, welcomeMessage]
  );

  const routeActions = variant === 'panel' ? PANEL_ROUTE_ACTIONS : LANDING_ROUTE_ACTIONS;
  const sendKeys = variant === 'panel' ? PANEL_SEND_KEYS : LANDING_SEND_KEYS;

  const chipPrompts = [
    ...routeActions.map((action) => t(action.key)),
    ...sendKeys.map((key) => t(key))
  ];

  const appendMessage = (message: Omit<VendorAssistantChatMessage, 'id'> & { id?: string }) => {
    setThreadMessages((current) => [
      ...current,
      { ...message, id: message.id ?? nextMessageId(message.role) }
    ]);
  };

  const resolveLandingReply = (text: string) => {
    const lower = text.toLowerCase();

    if (matchesIntent(lower, ['fee', 'commission', 'pricing', 'cost', 'plan'])) {
      return t('landingResponses.fees');
    }
    if (matchesIntent(lower, ['start', 'apply', 'onboard', 'sell', 'begin'])) {
      return t('landingResponses.startSelling');
    }
    if (matchesIntent(lower, ['dashboard', 'panel', 'manage', 'orders', 'inventory'])) {
      return t('landingResponses.dashboard');
    }
    if (matchesIntent(lower, ['support', 'contact', 'demo', 'help', 'talk'])) {
      return t('landingResponses.contact');
    }

    return t('landingResponses.default');
  };

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isPending) {
      return;
    }

    appendMessage({ role: 'user', content: trimmed });
    setIsPending(true);

    try {
      if (variant === 'panel') {
        if (activeStoreId <= 0) {
          appendMessage({ role: 'assistant', content: t('noActiveStore') });
          return;
        }

        const reply = await fetchVendorPanelInsight(activeStoreId, trimmed);
        appendMessage({
          role: 'assistant',
          content: reply || t('offline')
        });
        return;
      }

      appendMessage({
        role: 'assistant',
        content: resolveLandingReply(trimmed)
      });
    } catch {
      appendMessage({ role: 'assistant', content: t('offline') });
    } finally {
      setIsPending(false);
    }
  };

  const handleQuickPrompt = (label: string) => {
    const routeAction = routeActions.find((action) => t(action.key) === label);
    if (routeAction) {
      onNavigateAway?.();
      if (routeAction.href.startsWith('#')) {
        document.querySelector(routeAction.href)?.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      router.push(routeAction.href);
      return;
    }

    void handleSend(label);
  };

  return {
    messages,
    isPending,
    chipPrompts,
    chipLabel: t('quickPrompts'),
    handleSend,
    handleSuggestionClick: handleQuickPrompt
  };
}

function matchesIntent(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword));
}
