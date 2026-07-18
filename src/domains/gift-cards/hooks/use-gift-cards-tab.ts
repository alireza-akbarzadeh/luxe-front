'use client';

import { parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs';

const GIFT_CARDS_TABS = ['purchase', 'mine', 'redeem'] as const;

export type GiftCardsTab = (typeof GIFT_CARDS_TABS)[number];

/** Gift cards hub tab + Stripe return params synced to the URL via nuqs. */
export function useGiftCardsTab() {
  const [params, setParams] = useQueryStates({
    tab: parseAsStringLiteral(GIFT_CARDS_TABS).withDefault('purchase'),
    purchase: parseAsString,
    session_id: parseAsString
  });

  const handleTabChange = (value: string) => {
    const next = GIFT_CARDS_TABS.includes(value as GiftCardsTab)
      ? (value as GiftCardsTab)
      : 'purchase';

    void setParams({
      // Default tab stays out of the URL
      tab: next === 'purchase' ? null : next,
      // Drop Stripe return params when switching tabs manually
      purchase: null,
      session_id: null
    });
  };

  return {
    tab: params.tab,
    handleTabChange
  };
}
