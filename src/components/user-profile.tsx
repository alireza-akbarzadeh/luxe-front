'use client';

import { motion } from '@/components/motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  IconDashboard,
  IconHeart,
  IconLogin,
  IconLogout,
  IconMoon,
  IconSettings,
  IconShieldCheck,
  IconSun,
  IconUserCircle
} from '@tabler/icons-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { logoutAction } from '../actions/auth.actions';
import { useUser } from '../hooks/useUser';

interface UserProfileProps {
  variant?: 'sidebar' | 'header';
  isCollapsed?: boolean;
}

export function UserProfile({ variant = 'sidebar', isCollapsed = false }: UserProfileProps) {
  const { user, isAuthenticated } = useUser();
  const { theme, setTheme } = useTheme();

  const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';

  const userName = user?.first_name || 'Guest User';
  const userEmail = user?.email || 'guest@example.com';
  const userRole = (user?.role || 'USER').toLowerCase();
  const userId = user?.id || 'GUEST';

  const isAdmin = userRole === 'admin';
  const isModerator = userRole === 'moderator';
  const showDashboard = isAdmin || isModerator;

  const handleSignOut = async () => {
    await logoutAction();
  };

  const isHeader = variant === 'header';

  // Determines which icon to show for the theme toggle
  const ThemeIcon = theme === 'dark' ? IconSun : IconMoon;
  const themeLabel =
    nextTheme === 'light' ? 'Light mode' : nextTheme === 'dark' ? 'Dark mode' : 'System';

  return (
    <div
      className={cn(
        'transition-all duration-300',
        isHeader ? 'flex items-center' : isCollapsed ? 'p-2' : 'p-4'
      )}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              'group focus-visible:ring-primary/30 flex items-center rounded-xl border border-transparent transition-all duration-200 outline-none focus-visible:ring-2',
              isHeader
                ? 'p-0.5 hover:opacity-80'
                : 'hover:bg-accent/50 hover:border-border/50 w-full gap-3 p-2',
              !isHeader && isCollapsed && 'justify-center px-0'
            )}
          >
            {/* Avatar */}
            <div className='relative shrink-0'>
              <div
                className={cn(
                  'from-primary/10 to-secondary/10 ring-border group-hover:ring-primary/50 flex items-center justify-center rounded-lg bg-linear-to-br shadow-sm ring-1 transition-all',
                  isHeader ? 'h-8 w-8' : 'h-9 w-9'
                )}
              >
                <span className='text-foreground/80 text-xs font-medium'>
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* Online indicator */}
              <div className='absolute -right-0.5 -bottom-0.5 flex items-center justify-center'>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeOut'
                  }}
                  className={cn(
                    'absolute h-2.5 w-2.5 rounded-full',
                    isAuthenticated ? 'bg-emerald-500' : 'bg-red-500'
                  )}
                />
                <div
                  className={cn(
                    'border-background relative z-10 h-2.5 w-2.5 rounded-full border-2',
                    isAuthenticated ? 'bg-emerald-500' : 'bg-red-500'
                  )}
                />
              </div>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className='w-72 p-2'
          side={isHeader ? 'bottom' : isCollapsed ? 'right' : 'top'}
          align={isHeader ? 'end' : 'center'}
          sideOffset={12}
        >
          {/* User info header */}
          <DropdownMenuLabel className='p-3'>
            <div className='flex flex-col gap-1'>
              <p className='text-muted-foreground text-[11px] font-medium tracking-tighter uppercase'>
                Signed in as
              </p>
              <p className='text-foreground truncate text-sm font-semibold'>{userEmail}</p>
              <div className='text-muted-foreground flex items-center gap-2 text-[10px]'>
                <span className='flex items-center gap-1'>
                  <IconShieldCheck className='h-3 w-3' />
                  {userRole}
                </span>
                <span>•</span>
                <span>ID: {userId}</span>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            {showDashboard && (
              <DropdownMenuItem asChild>
                <Link
                  href='/dashboard'
                  className='group focus:bg-primary/10 focus:text-primary flex cursor-pointer items-center gap-3 rounded-lg p-2.5'
                >
                  <IconDashboard
                    size={16}
                    className='text-muted-foreground group-focus:text-primary'
                  />
                  <div className='flex flex-col'>
                    <span className='text-sm font-medium'>Dashboard</span>
                    <span className='text-muted-foreground text-[10px]'>Manage your platform</span>
                  </div>
                </Link>
              </DropdownMenuItem>
            )}
            {isAuthenticated && (
              <>
                <DropdownMenuItem asChild>
                  <Link
                    href='/account'
                    className='group focus:bg-primary/10 focus:text-primary flex w-full cursor-pointer items-center gap-3 rounded-lg p-2.5'
                  >
                    <IconUserCircle
                      size={16}
                      className='text-muted-foreground group-focus:text-primary'
                    />
                    <div className='flex flex-col text-left'>
                      <span className='text-sm font-medium'>My Profile</span>
                      <span className='text-muted-foreground text-[10px]'>
                        Work & Personal details
                      </span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href='/wishlist'
                    className='group focus:bg-primary/10 focus:text-primary flex w-full cursor-pointer items-center gap-3 rounded-lg p-2.5'
                  >
                    <IconHeart
                      size={16}
                      className='text-muted-foreground group-focus:text-primary'
                    />
                    <div className='flex flex-col text-left'>
                      <span className='text-sm font-medium'>My Wishlist</span>
                      <span className='text-muted-foreground text-[10px]'>your item loved</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem asChild>
              <button className='group focus:bg-primary/10 focus:text-primary flex w-full cursor-pointer items-center gap-3 rounded-lg p-2.5'>
                <IconSettings
                  size={16}
                  className='text-muted-foreground group-focus:text-primary'
                />
                <div className='flex flex-col text-left'>
                  <span className='text-sm font-medium'>Preferences</span>
                  <span className='text-muted-foreground text-[10px]'>System settings</span>
                </div>
              </button>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <button
                onClick={() => setTheme(nextTheme)}
                className='group focus:bg-primary/10 focus:text-primary flex w-full cursor-pointer items-center gap-3 rounded-lg p-4.5'
              >
                <ThemeIcon size={16} className='text-muted-foreground group-focus:text-primary' />
                <div className='flex flex-col text-left'>
                  <span className='text-sm font-medium'>Switch Theme</span>
                  <span className='text-muted-foreground text-[10px]'>{themeLabel}</span>
                </div>
              </button>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />
          {isAuthenticated ? (
            <DropdownMenuItem asChild>
              <button
                onClick={handleSignOut}
                className='text-destructive focus:bg-destructive/10 focus:text-destructive flex w-full cursor-pointer items-center gap-3 rounded-lg p-2.5'
              >
                <IconLogout size={16} />
                <span className='text-sm font-medium'>Sign out</span>
              </button>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem asChild>
              <button
                onClick={handleSignOut}
                className='flex w-full cursor-pointer items-center gap-3 rounded-lg p-2.5'
              >
                <IconLogin size={16} />
                <span className='text-sm font-medium'>log in</span>
                <span className='text-muted-foreground text-[10px]'></span>
              </button>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
