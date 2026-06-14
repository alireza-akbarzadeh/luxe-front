import {
  IconHeart,
  IconMapPin,
  IconPackage,
  IconSettings,
  IconUser,
  IconWallet,
  type TablerIcon
} from '@tabler/icons-react';

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
  { id: 'payment', label: 'Wallet', icon: IconWallet },
  { id: 'settings', label: 'Settings', icon: IconSettings }
];

export { menuItems };
