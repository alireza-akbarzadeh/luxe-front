'use client';

import { useTranslations } from 'next-intl';

import { ACCOUNT_MENU_CONFIG } from '../data';

/** Sidebar / mobile tab labels from `account.nav` messages. */
export function useAccountMenuItems() {
  const t = useTranslations('account.nav');

  return ACCOUNT_MENU_CONFIG.map((item) => ({
    ...item,
    label: t(item.id)
  }));
}
