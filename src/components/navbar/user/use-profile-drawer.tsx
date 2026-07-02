'use client';

import { UserProfileTrigger } from '@/components/navbar/user/user-profile-trigger';
import { useProfileDrawerStore } from '@/stores/profile-drawer-store';

/** Navbar profile button — opens the shared bottom-sheet account menu on mobile. */
export function UserProfileDrawer() {
  const openProfileDrawer = useProfileDrawerStore((state) => state.openProfileDrawer);

  return <UserProfileTrigger onClick={openProfileDrawer} />;
}
