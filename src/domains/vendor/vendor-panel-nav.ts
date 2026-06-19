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

export const VENDOR_NAV_GROUPS: VendorNavGroup[] = [
  {
    id: 'main',
    label: 'Main',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        href: '/vendor/panel',
        icon: IconLayoutDashboard,
        description: 'Business overview and KPIs'
      }
    ]
  },
  {
    id: 'commerce',
    label: 'Commerce',
    items: [
      {
        id: 'orders',
        label: 'Orders',
        href: '/vendor/panel/orders',
        icon: IconShoppingBag,
        description: 'Fulfillment and order management',
        badge: '12'
      },
      {
        id: 'products',
        label: 'Products',
        href: '/vendor/panel/products',
        icon: IconPackage,
        description: 'Catalog, variants, and media'
      },
      {
        id: 'categories',
        label: 'Categories',
        href: '/vendor/panel/categories',
        icon: IconCategory,
        description: 'Category tree and attributes'
      },
      {
        id: 'inventory',
        label: 'Inventory',
        href: '/vendor/panel/inventory',
        icon: IconMapPin,
        description: 'Stock, warehouses, and transfers'
      }
    ]
  },
  {
    id: 'customers',
    label: 'Customers',
    items: [
      {
        id: 'customers',
        label: 'Customers',
        href: '/vendor/panel/customers',
        icon: IconUsers,
        description: 'Profiles, segments, and LTV'
      },
      {
        id: 'messages',
        label: 'Messages',
        href: '/vendor/panel/messages',
        icon: IconMessage,
        description: 'Buyer conversations',
        badge: '3'
      },
      {
        id: 'reviews',
        label: 'Reviews',
        href: '/vendor/panel/reviews',
        icon: IconStar,
        description: 'Ratings and responses'
      }
    ]
  },
  {
    id: 'growth',
    label: 'Growth',
    items: [
      {
        id: 'discounts',
        label: 'Discounts',
        href: '/vendor/panel/discounts',
        icon: IconDiscount,
        description: 'Coupons and promotions'
      },
      {
        id: 'marketing',
        label: 'Marketing',
        href: '/vendor/panel/marketing',
        icon: IconMail,
        description: 'Campaigns and automation'
      },
      {
        id: 'analytics',
        label: 'Analytics',
        href: '/vendor/panel/analytics',
        icon: IconChartBar,
        description: 'Performance insights'
      }
    ]
  },
  {
    id: 'finance',
    label: 'Finance',
    items: [
      {
        id: 'finance',
        label: 'Finance',
        href: '/vendor/panel/finance',
        icon: IconCreditCard,
        description: 'Revenue, fees, and taxes'
      },
      {
        id: 'payouts',
        label: 'Payouts',
        href: '/vendor/panel/payouts',
        icon: IconWallet,
        description: 'Withdrawals and statements'
      }
    ]
  },
  {
    id: 'operations',
    label: 'Operations',
    items: [
      {
        id: 'shipping',
        label: 'Shipping',
        href: '/vendor/panel/shipping',
        icon: IconTruck,
        description: 'Rates, zones, and labels'
      },
      {
        id: 'returns',
        label: 'Returns',
        href: '/vendor/panel/returns',
        icon: IconRotate,
        description: 'RMAs and refunds'
      },
      {
        id: 'support',
        label: 'Support Tickets',
        href: '/vendor/panel/support',
        icon: IconHeadset,
        description: 'Seller support center'
      }
    ]
  },
  {
    id: 'insights',
    label: 'Insights',
    items: [
      {
        id: 'reports',
        label: 'Reports',
        href: '/vendor/panel/reports',
        icon: IconReportAnalytics,
        description: 'Exportable business reports'
      }
    ]
  },
  {
    id: 'settings',
    label: 'Settings',
    items: [
      {
        id: 'store',
        label: 'Store Settings',
        href: '/vendor/panel/store',
        icon: IconBuildingStore,
        description: 'Branding, policies, and SEO'
      },
      {
        id: 'team',
        label: 'Team Members',
        href: '/vendor/panel/team',
        icon: IconUsers,
        description: 'Roles and permissions'
      },
      {
        id: 'notifications',
        label: 'Notifications',
        href: '/vendor/panel/notifications',
        icon: IconBell,
        description: 'Alert preferences'
      },
      {
        id: 'integrations',
        label: 'Apps & Integrations',
        href: '/vendor/panel/integrations',
        icon: IconApps,
        description: 'Connected services'
      },
      {
        id: 'help',
        label: 'Help Center',
        href: '/vendor/panel/help',
        icon: IconHelp,
        description: 'Guides and documentation'
      }
    ]
  }
];

export const VENDOR_LOGOUT_ITEM: VendorNavItem = {
  id: 'logout',
  label: 'Logout',
  href: '#logout',
  icon: IconLogout,
  description: 'Sign out of vendor dashboard'
};

/** Flat list for command palette search. */
export function flattenVendorNav(): VendorNavItem[] {
  return VENDOR_NAV_GROUPS.flatMap((group) => group.items);
}

/** @deprecated Use VENDOR_NAV_GROUPS — kept for gradual migration. */
export const VENDOR_PANEL_NAV = flattenVendorNav();

export function findVendorNavItem(pathname: string): VendorNavItem | undefined {
  const items = flattenVendorNav();
  return items.find((item) =>
    item.href === '/vendor/panel' ? pathname === item.href : pathname.startsWith(item.href)
  );
}
