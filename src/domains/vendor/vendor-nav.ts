import type { TablerIcon } from '@tabler/icons-react';
import {
  IconBuildingStore,
  IconLayoutDashboard,
  IconPackage,
  IconShoppingBag
} from '@tabler/icons-react';

export interface VendorNavItem {
  label: string;
  href: string;
  icon: TablerIcon;
  description?: string;
}

/** Static vendor panel navigation until backend vendor scopes ship. */
export const VENDOR_PANEL_NAV: VendorNavItem[] = [
  {
    label: 'Overview',
    href: '/vendor/panel',
    icon: IconLayoutDashboard,
    description: 'Snapshot of your storefront performance'
  },
  {
    label: 'Products',
    href: '/vendor/panel/products',
    icon: IconPackage,
    description: 'Catalog, pricing, and inventory'
  },
  {
    label: 'Orders',
    href: '/vendor/panel/orders',
    icon: IconShoppingBag,
    description: 'Fulfillment and customer orders'
  },
  {
    label: 'Store',
    href: '/vendor/panel/store',
    icon: IconBuildingStore,
    description: 'Profile, policies, and branding'
  }
];
