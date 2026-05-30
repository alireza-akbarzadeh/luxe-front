import {
  IconBell,
  IconDashboard,
  IconGitCompare,
  IconHeart,
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
    title: 'Wishlist',
    subtitle: 'Saved products & favorites',
    icon: IconHeart
  },
  {
    type: 'link',
    href: '/compare',
    subtitle: 'Find your perfect match',
    title: 'Compare',
    icon: IconGitCompare
  },
  {
    type: 'button',
    title: 'Notifications',
    subtitle: 'Manage alerts & updates',
    icon: IconBell
  },
  {
    type: 'button',
    title: 'Settings',
    subtitle: 'Preferences & privacy',
    icon: IconSettings
  }
];
