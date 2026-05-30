'use client';

import { UserProfileDrawer } from '@/components/navbar/user/use-profile-drawer';
import { UserProfileDropdown } from '@/components/navbar/user/user-profile-dropdown';
import { useMediaDevices } from '@/hooks/useMediaDevices';

export function UserProfile() {
  const { isMobile } = useMediaDevices();

  if (isMobile) {
    return <UserProfileDrawer />;
  }

  return <UserProfileDropdown />;
}
