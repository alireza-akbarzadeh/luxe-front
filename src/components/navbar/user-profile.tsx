'use client';

import {
  IconBell,
  IconChevronRight,
  IconDashboard,
  IconHeart,
  IconLogout,
  IconMoon,
  IconSettings,
  IconSparkles,
  IconSun,
  IconUserCircle
} from '@tabler/icons-react';
import { AnimatePresence,motion } from 'framer-motion';
import { useTheme } from 'next-themes';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { MenuButton } from '~/src/components/navbar/menu-button';
import { MenuLink } from '~/src/components/navbar/menu-link';

import { logoutAction } from '../../actions/auth.actions';
import { useUser } from '../../hooks/useUser';

interface UserProfileProps {
  className?: string;
}

export function UserProfile({ className }: UserProfileProps) {
  const { user, isAuthenticated } = useUser();
  const { theme, setTheme } = useTheme();

  const isLoggedIn = isAuthenticated && !!user;
  const nextTheme = theme === 'light' ? 'dark' : 'light';

  const userName =
    user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : 'Guest User';

  const userEmail = user?.email || 'guest@example.com';

  const avatarFallback = userName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await logoutAction();
  };

  const statusColor = isLoggedIn ? 'text-emerald-500' : 'text-red-500';
  const statusDot = isLoggedIn ? 'bg-emerald-500' : 'bg-red-500';
  const sessionDot = isLoggedIn ? 'bg-emerald-400' : 'bg-red-400';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            'group relative outline-none',
            'focus-visible:ring-primary/40 rounded-2xl focus-visible:ring-2',
            className
          )}
        >
          {/* Glow */}
          <div className='from-primary/20 absolute inset-0 rounded-2xl bg-linear-to-r to-transparent opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100' />

          {/* Main */}
          <div
            className={cn(
              'border-border/50 bg-background/70 relative flex items-center gap-3 rounded-2xl border px-3 py-2 backdrop-blur-xl transition-all duration-300',
              'hover:border-primary/30 hover:bg-accent/40 hover:shadow-2xl'
            )}
          >
            {/* Avatar */}
            <div className='relative'>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className='from-primary via-primary/80 to-secondary flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br shadow-lg'
              >
                <span className='text-sm font-bold text-white'>{avatarFallback}</span>
              </motion.div>

              {/* Status dot */}
              <div
                className={cn(
                  'border-background absolute -right-0.5 -bottom-0.5 h-3.5 w-3.5 rounded-full border-2',
                  statusDot
                )}
              />
            </div>

            {/* User Info */}
            <div className='hidden min-w-0 text-left md:block'>
              <p className='text-foreground truncate text-sm font-semibold'>{userName}</p>

              <div className='text-muted-foreground flex items-center gap-1 text-xs'>
                <span className='truncate'>{userEmail}</span>

                <span>•</span>

                <span className={cn('flex items-center gap-1', statusColor)}>
                  <IconSparkles size={12} />
                  {isLoggedIn ? 'online' : 'offline'}
                </span>
              </div>
            </div>

            <IconChevronRight
              size={16}
              className='text-muted-foreground hidden transition-transform duration-300 group-hover:translate-x-0.5 md:block'
            />
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align='end'
        sideOffset={14}
        className='border-border/50 bg-background/80 w-[340px] overflow-hidden rounded-3xl border p-0 shadow-2xl backdrop-blur-2xl'
      >
        {/* Top Banner */}
        <div
          className={cn(
            'relative overflow-hidden p-5',
            'bg-gradient-to-r from-slate-50 via-white to-slate-100',
            'dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800'
          )}
        >
          {/* soft light glow */}
          <div className='absolute inset-0 opacity-40 dark:opacity-20'>
            <div className='bg-primary/20 absolute -top-10 -right-10 h-32 w-32 rounded-full blur-3xl' />
            <div className='absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-indigo-300/20 blur-3xl' />
          </div>

          <div className='relative flex items-center gap-4'>
            <div className='flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-xl font-bold shadow-xl ring-1 ring-white/20 backdrop-blur-xl'>
              {avatarFallback}
            </div>

            <div className='min-w-0 flex-1'>
              <h3 className='truncate text-lg font-semibold'>{userName}</h3>

              <p className='truncate text-sm text-white/80'>{userEmail}</p>

              <div className='mt-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-2.5 py-1 text-xs backdrop-blur-xl'>
                <div className={cn('h-2 w-2 rounded-full', sessionDot)} />
                {isLoggedIn ? 'Active session' : 'No active session'}
              </div>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className='p-2'>
          <MenuLink
            href='/account'
            icon={<IconUserCircle size={18} />}
            title='My Profile'
            subtitle='Manage account information'
          />

          <MenuLink
            href='/dashboard'
            icon={<IconDashboard size={18} />}
            title='Dashboard'
            subtitle='Workspace overview'
          />

          <MenuLink
            href='/wishlist'
            icon={<IconHeart size={18} />}
            title='Wishlist'
            subtitle='Saved products & favorites'
          />

          {/* Theme toggle */}
          <DropdownMenuItem asChild>
            <button
              onClick={() => setTheme(nextTheme)}
              className='group hover:bg-accent/60 flex w-full cursor-pointer items-center gap-3 rounded-2xl p-3 transition-all'
            >
              <div className='bg-muted flex h-10 w-10 items-center justify-center rounded-xl'>
                <AnimatePresence mode='wait'>
                  <motion.div
                    key={theme}
                    initial={{ opacity: 0, rotate: -90, scale: 0.7 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0.7 }}
                    transition={{ duration: 0.2 }}
                  >
                    {theme === 'dark' ? (
                      <IconSun size={18} />
                    ) : (
                      <IconMoon className='hover:text-black' size={18} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className='flex flex-col text-left'>
                <span className='text-sm font-medium'>Appearance </span>
                <span className='text-muted-foreground text-xs'>Switch between light & dark</span>
              </div>
            </button>
          </DropdownMenuItem>

          <MenuButton
            icon={<IconBell size={18} />}
            title='Notifications'
            subtitle='Manage alerts & updates'
          />

          <MenuButton
            icon={<IconSettings size={18} />}
            title='Settings'
            subtitle='Preferences & privacy'
          />

          <DropdownMenuSeparator className='my-2' />

          {/* Auth action (Login / Logout) */}
          <DropdownMenuItem asChild>
            <button
              onClick={isLoggedIn ? handleLogout : () => (window.location.href = '/login')}
              className={cn(
                'flex w-full cursor-pointer items-center gap-3 rounded-2xl p-3 transition-all',
                isLoggedIn ? 'hover:bg-destructive/10 text-destructive' : 'hover:bg-accent/60'
              )}
            >
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-xl',
                  isLoggedIn ? 'bg-destructive/10' : 'bg-muted'
                )}
              >
                {isLoggedIn ? <IconLogout size={18} /> : <IconUserCircle size={18} />}
              </div>

              <div className='flex flex-col text-left'>
                <span className='text-sm font-medium'>{isLoggedIn ? 'Sign out' : 'Log in'}</span>

                <span className='text-muted-foreground text-xs'>
                  {isLoggedIn ? 'End current session' : 'Access your account'}
                </span>
              </div>
            </button>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
