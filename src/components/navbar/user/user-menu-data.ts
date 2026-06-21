import {
  IconBell,
  IconBuildingStore,
  IconDashboard,
  IconHeart,
  IconLayersIntersect2,
  IconSettings,
  IconUserCircle
} from '@tabler/icons-react';

export type ProfileMenuItemKey =
  | 'profile'
  | 'dashboard'
  | 'wishlist'
  | 'stores'
  | 'compare'
  | 'notifications'
  | 'settings';

export const profileMenuItems: Array<{
  type: 'link' | 'button';
  href?: string;
  key: ProfileMenuItemKey;
  icon: typeof IconUserCircle;
}> = [
  {
    type: 'link',
    href: '/account',
    key: 'profile',
    icon: IconUserCircle
  },
  {
    type: 'link',
    href: '/dashboard',
    key: 'dashboard',
    icon: IconDashboard
  },
  {
    type: 'link',
    href: '/wishlist',
    key: 'wishlist',
    icon: IconHeart
  },
  {
    type: 'link',
    href: '/store',
    key: 'stores',
    icon: IconBuildingStore
  },
  {
    type: 'link',
    href: '/compare',
    key: 'compare',
    icon: IconLayersIntersect2
  },
  {
    type: 'link',
    href: '/notifications',
    key: 'notifications',
    icon: IconBell
  },
  {
    type: 'button',
    key: 'settings',
    icon: IconSettings
  }
];
