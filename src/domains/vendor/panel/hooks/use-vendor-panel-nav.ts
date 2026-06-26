'use client';

import { useTranslations } from 'next-intl';

import {
  VENDOR_LOGOUT_ITEM_DEF,
  VENDOR_NAV_GROUP_DEFS,
  type VendorNavGroup,
  type VendorNavItem
} from '@/domains/vendor/vendor-panel-nav';

/** Resolves vendor panel sidebar / command palette labels from `vendor.panel.nav`. */
export function useVendorPanelNav(): {
  groups: VendorNavGroup[];
  logoutItem: VendorNavItem;
} {
  const t = useTranslations('vendor.panel.nav');

  const groups: VendorNavGroup[] = VENDOR_NAV_GROUP_DEFS.map((group) => ({
    id: group.id,
    label: t(`groups.${group.id}`),
    items: group.items.map((item) => ({
      ...item,
      label: t(`items.${item.id}.label`),
      description: t(`items.${item.id}.description`)
    }))
  }));

  const logoutItem: VendorNavItem = {
    ...VENDOR_LOGOUT_ITEM_DEF,
    label: t('items.logout.label'),
    description: t('items.logout.description')
  };

  return { groups, logoutItem };
}
