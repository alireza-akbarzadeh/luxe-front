import {
  IconCreditCard,
  IconHeart,
  IconMapPin,
  IconPackage,
  IconSettings,
  IconUser,
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
  { id: 'payment', label: 'Payment Methods', icon: IconCreditCard },
  { id: 'settings', label: 'Settings', icon: IconSettings }
];

export { menuItems };
