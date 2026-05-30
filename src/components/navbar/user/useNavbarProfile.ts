import { useTheme } from 'next-themes';
import { useState } from 'react';

import { logoutAction } from '@/actions/auth.actions';
import { useUser } from '@/hooks/useUser';

export function useNavbarProfile() {
  const { user, isAuthenticated } = useUser();
  const [openMenu, setOpenMenu] = useState(false);
  const { theme, setTheme } = useTheme();

  const isLoggedIn = isAuthenticated && !!user;

  const userName =
    user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : 'Guest User';

  const userEmail = user?.email ?? 'guest@example.com';

  const avatarFallback = userName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await logoutAction();
  };

  return {
    theme,
    openMenu,
    setOpenMenu,
    setTheme,
    isLoggedIn,
    userName,
    userEmail,
    avatarFallback,
    handleLogout,
    statusColor: isLoggedIn ? 'text-emerald-500' : 'text-red-500',
    statusDot: isLoggedIn ? 'bg-emerald-500' : 'bg-red-500',
    sessionDot: isLoggedIn ? 'bg-emerald-400' : 'bg-red-400'
  };
}
