import type { TablerIcon } from '@tabler/icons-react';
import {
  IconApps,
  IconBell,
  IconBuildingStore,
  IconCategory,
  IconChartBar,
  IconCreditCard,
  IconDiscount,
  IconHeadset,
  IconHelp,
  IconLayoutDashboard,
  IconLogout,
  IconMail,
  IconMapPin,
  IconMessage,
  IconPackage,
  IconReportAnalytics,
  IconRotate,
  IconShoppingBag,
  IconStar,
  IconTruck,
  IconUser,
  IconUsers,
  IconWallet
} from '@tabler/icons-react';

export interface VendorNavItem {
  id: string;
  label: string;
  href: string;
  icon: TablerIcon;
  description?: string;
  badge?: string;
}

export interface VendorNavGroup {
  id: string;
  label: string;
  items: VendorNavItem[];
}

interface VendorNavItemDef {
  id: string;
  href: string;
  icon: TablerIcon;
  badge?: string;
}

interface VendorNavGroupDef {
  id: string;
  items: VendorNavItemDef[];
}

export const VENDOR_NAV_GROUP_DEFS: VendorNavGroupDef[] = [
  {
    id: 'main',
    items: [
      {
        id: 'dashboard',
        href: '/vendor/panel',
        icon: IconLayoutDashboard
      }
    ]
  },
  {
    id: 'commerce',
    items: [
      {
        id: 'orders',
        href: '/vendor/panel/orders',
        icon: IconShoppingBag,
        badge: '128'
      },
      {
        id: 'products',
        href: '/vendor/panel/products',
        icon: IconPackage,
        badge: '542'
      },
      {
        id: 'categories',
        href: '/vendor/panel/categories',
        icon: IconCategory
      },
      {
        id: 'inventory',
        href: '/vendor/panel/inventory',
        icon: IconMapPin
      }
    ]
  },
  {
    id: 'customers',
    items: [
      {
        id: 'customers',
        href: '/vendor/panel/customers',
        icon: IconUsers,
        badge: '1.2k'
      },
      {
        id: 'messages',
        href: '/vendor/panel/messages',
        icon: IconMessage,
        badge: '8'
      },
      {
        id: 'reviews',
        href: '/vendor/panel/reviews',
        icon: IconStar,
        badge: '24'
      }
    ]
  },
  {
    id: 'growth',
    items: [
      {
        id: 'discounts',
        href: '/vendor/panel/discounts',
        icon: IconDiscount
      },
      {
        id: 'marketing',
        href: '/vendor/panel/marketing',
        icon: IconMail
      },
      {
        id: 'analytics',
        href: '/vendor/panel/analytics',
        icon: IconChartBar
      }
    ]
  },
  {
    id: 'finance',
    items: [
      {
        id: 'finance',
        href: '/vendor/panel/finance',
        icon: IconCreditCard
      },
      {
        id: 'payouts',
        href: '/vendor/panel/payouts',
        icon: IconWallet
      }
    ]
  },
  {
    id: 'operations',
    items: [
      {
        id: 'shipping',
        href: '/vendor/panel/shipping',
        icon: IconTruck
      },
      {
        id: 'returns',
        href: '/vendor/panel/returns',
        icon: IconRotate
      },
      {
        id: 'support',
        href: '/vendor/panel/support',
        icon: IconHeadset
      }
    ]
  },
  {
    id: 'insights',
    items: [
      {
        id: 'reports',
        href: '/vendor/panel/reports',
        icon: IconReportAnalytics
      }
    ]
  },
  {
    id: 'settings',
    items: [
      {
        id: 'account',
        href: '/vendor/panel/account',
        icon: IconUser
      },
      {
        id: 'store',
        href: '/vendor/panel/store',
        icon: IconBuildingStore
      },
      {
        id: 'team',
        href: '/vendor/panel/team',
        icon: IconUsers
      },
      {
        id: 'notifications',
        href: '/vendor/panel/notifications',
        icon: IconBell
      },
      {
        id: 'integrations',
        href: '/vendor/panel/integrations',
        icon: IconApps
      },
      {
        id: 'help',
        href: '/vendor/panel/help',
        icon: IconHelp
      }
    ]
  }
];

export const VENDOR_LOGOUT_ITEM_DEF = {
  id: 'logout',
  href: '#logout',
  icon: IconLogout
} as const;

export const VENDOR_LOGOUT_ITEM: VendorNavItem = {
  ...VENDOR_LOGOUT_ITEM_DEF,
  label: 'Logout',
  description: 'Sign out of vendor dashboard'
};

/** Flat list for command palette search. */
export function flattenVendorNav(): VendorNavItem[] {
  return flattenVendorNavGroups(VENDOR_NAV_GROUPS);
}

/** @deprecated Use `useVendorPanelNav` — kept for gradual migration. */
export const VENDOR_NAV_GROUPS: VendorNavGroup[] = VENDOR_NAV_GROUP_DEFS.map((group) => ({
  id: group.id,
  label: group.id,
  items: group.items.map((item) => ({
    ...item,
    label: item.id,
    description: undefined
  }))
}));

/** @deprecated Use flattenVendorNavGroups with `useVendorPanelNav` */
export const VENDOR_PANEL_NAV = flattenVendorNav();

export function flattenVendorNavGroups(groups: VendorNavGroup[]): VendorNavItem[] {
  return groups.flatMap((group) => group.items);
}

export function findVendorNavItem(
  pathname: string,
  groups: VendorNavGroup[]
): VendorNavItem | undefined {
  const items = flattenVendorNavGroups(groups);
  return items.find((item) =>
    item.href === '/vendor/panel' ? pathname === item.href : pathname.startsWith(item.href)
  );
}
