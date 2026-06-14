'use client';

import { parseAsStringLiteral, useQueryState } from 'nuqs';

import type { AccountTab } from '../data';

const tabs = [
  'overview',
  'orders',
  'wishlist',
  'addresses',
  'payment',
  'notifications',
  'settings'
] as const;

export function useSidebarTab() {
  const [activeTab, setActiveTab] = useQueryState(
    'tab',
    parseAsStringLiteral(tabs).withDefault('overview')
  );
  const handleTabChange = (value: string) => {
    setActiveTab(value as AccountTab);
  };

  return { activeTab, setActiveTab, handleTabChange };
}
