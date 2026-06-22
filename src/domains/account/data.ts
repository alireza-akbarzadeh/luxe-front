import {
  IconBell,
  IconHeart,
  IconMapPin,
  IconPackage,
  IconSettings,
  IconUser,
  IconWallet,
  type TablerIcon
} from '@tabler/icons-react';

export type AccountTab =
  | 'overview'
  | 'orders'
  | 'wishlist'
  | 'addresses'
  | 'payment'
  | 'notifications'
  | 'settings';

type AccountMenuConfigItem = {
  id: AccountTab;
  icon: TablerIcon;
};

const ACCOUNT_MENU_CONFIG: AccountMenuConfigItem[] = [
  { id: 'overview', icon: IconUser },
  { id: 'orders', icon: IconPackage },
  { id: 'wishlist', icon: IconHeart },
  { id: 'addresses', icon: IconMapPin },
  { id: 'payment', icon: IconWallet },
  { id: 'notifications', icon: IconBell },
  { id: 'settings', icon: IconSettings }
];

export { ACCOUNT_MENU_CONFIG };
