import {
  IconCreditCard,
  IconHeart,
  IconMapPin,
  IconPackage,
  IconSettings,
  IconUser,
  type TablerIcon
} from '@tabler/icons-react';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  shipped: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
};

export type AccountTab = 'overview' | 'orders' | 'wishlist' | 'addresses' | 'payment' | 'settings';

type MenuItems = {
  id: AccountTab;
  label: string;
  icon: TablerIcon;
};

const menuItems: MenuItems[] = [
  { id: 'overview', label: 'Overview', icon: IconUser },
  { id: 'orders', label: 'Orders', icon: IconPackage },
  { id: 'wishlist', label: 'Wishlist', icon: IconHeart },
  { id: 'addresses', label: 'Addresses', icon: IconMapPin },
  { id: 'payment', label: 'Payment Methods', icon: IconCreditCard },
  { id: 'settings', label: 'Settings', icon: IconSettings }
];

export { menuItems, statusColors };
