import {
  IconBell,
  IconGift,
  IconHeart,
  IconMapPin,
  IconMessageCircle,
  IconPackage,
  IconSettings,
  IconSparkles,
  IconUser,
  IconWallet,
  type TablerIcon
} from '@tabler/icons-react';

export type AccountTab =
  | 'overview'
  | 'orders'
  | 'wishlist'
  | 'activity'
  | 'giftCards'
  | 'addresses'
  | 'payment'
  | 'plans'
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
  { id: 'activity', icon: IconMessageCircle },
  { id: 'giftCards', icon: IconGift },
  { id: 'addresses', icon: IconMapPin },
  { id: 'payment', icon: IconWallet },
  { id: 'plans', icon: IconSparkles },
  { id: 'notifications', icon: IconBell },
  { id: 'settings', icon: IconSettings }
];

export { ACCOUNT_MENU_CONFIG };
