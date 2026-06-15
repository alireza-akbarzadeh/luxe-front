import {
  IconBell,
  IconBuildingStore,
  IconDashboard,
  IconHeart,
  IconLayersIntersect2,
  IconSettings,
  IconUserCircle
} from '@tabler/icons-react';

export const profileMenuItems = [
  {
    type: 'link',
    href: '/account',
    title: 'My Profile',
    subtitle: 'Manage account information',
    icon: IconUserCircle
  },
  {
    type: 'link',
    href: '/dashboard',
    title: 'Dashboard',
    subtitle: 'Workspace overview',
    icon: IconDashboard
  },
  {
    type: 'link',
    href: '/wishlist',
    title: 'My Wishlist',
    subtitle: 'Products you saved for later',
    icon: IconHeart
  },
  {
    type: 'link',
    href: '/store',
    title: 'Stores',
    subtitle: 'Browse all available stores',
    icon: IconBuildingStore
  },
  {
    type: 'link',
    href: '/compare',
    subtitle: 'Find your perfect match',
    title: 'Compare',
    icon: IconLayersIntersect2
  },
  {
    type: 'link',
    href: '/notifications',
    title: 'Notifications',
    subtitle: 'Order and shipping alerts',
    icon: IconBell
  },
  {
    type: 'button',
    title: 'Settings',
    subtitle: 'Preferences & privacy',
    icon: IconSettings
  }
];
