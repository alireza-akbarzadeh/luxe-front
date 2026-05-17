import { AnimatePresence, motion } from '@/components/motion';
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
import { logoutAction } from '../actions/auth.actions';
import {
  IconChevronRight,
  IconDashboard,
  IconLogout,
  IconMoon,
  IconSettings,
  IconShieldCheck,
  IconSun,
  IconUserCircle
} from '@tabler/icons-react';
import { useUser } from '../hooks/useUser';
import Link from 'next/link';
import { Button } from './ui/button';
import { useTheme } from 'next-themes';

interface UserProfileProps {
  variant?: 'sidebar' | 'header';
  isCollapsed?: boolean;
}

export function UserProfile({ variant = 'sidebar', isCollapsed = false }: UserProfileProps) {
  const { user } = useUser();
  const { theme, setTheme } = useTheme();
  const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
  const avatarSeed = user?.email || 'Guest';
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
            {/* Avatar Section */}
            <div className='relative shrink-0'>
              <div
                className={cn(
                  'from-primary/10 to-secondary/10 ring-border group-hover:ring-primary/50 flex items-center justify-center rounded-lg bg-gradient-to-br object-cover shadow-sm ring-1 transition-all',
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
                  className='absolute h-2.5 w-2.5 rounded-full bg-emerald-500'
                />
                <div className='border-card relative z-10 h-2.5 w-2.5 rounded-full border-2 bg-emerald-500' />
              </div>
            </div>

            {/* Name and Role - Sidebar only (if not collapsed) */}
            {!isHeader && (
              <AnimatePresence mode='wait'>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className='flex min-w-0 flex-1 flex-col items-start'
                  >
                    <p className='text-foreground mb-1 w-full truncate text-left text-sm leading-none font-semibold'>
                      {userName}
                    </p>
                    <div className='flex items-center gap-1.5'>
                      <IconShieldCheck className='h-3 w-3 text-indigo-500' />
                      <p className='text-muted-foreground text-[10px] font-medium tracking-wider uppercase'>
                        {userRole}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {/* Chevron - Sidebar only (if not collapsed) */}
            {!isHeader && !isCollapsed && (
              <IconChevronRight
                size={14}
                className='text-muted-foreground group-hover:text-foreground transition-all group-data-[state=open]:rotate-90'
              />
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className='border-border/50 bg-popover/95 w-72 rounded-2xl p-2 shadow-xl backdrop-blur-md'
          side={isHeader ? 'bottom' : isCollapsed ? 'right' : 'top'}
          align={isHeader ? 'end' : 'center'}
          sideOffset={12}
        >
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
            {/* Dashboard link for admin/moderator */}
            {showDashboard && (
              <DropdownMenuItem asChild>
                <Link
                  href='/dashboard'
                  className='focus:bg-primary/10 focus:text-primary group flex cursor-pointer items-center gap-3 rounded-lg p-2.5'
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

            <DropdownMenuItem>
              <Link
                href='/account'
                className='focus:bg-primary/10 focus:text-primary group flex w-full cursor-pointer items-center gap-3 rounded-lg p-2.5'
              >
                <IconUserCircle
                  size={16}
                  className='text-muted-foreground group-focus:text-primary'
                />
                <div className='flex flex-col text-left'>
                  <span className='text-sm font-medium'>My Profile</span>
                  <span className='text-muted-foreground text-[10px]'>Work & Personal details</span>
                </div>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem>
              <button className='focus:bg-primary/10 focus:text-primary group flex w-full cursor-pointer items-center gap-3 rounded-lg p-2.5'>
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
            <DropdownMenuItem>
              <button
                onClick={() => setTheme(nextTheme)}
                className='focus:bg-primary/10 focus:text-primary group flex w-full cursor-pointer items-center gap-3 rounded-lg p-2.5'
              >
                <IconMoon size={16} className='text-muted-foreground group-focus:text-primary' />
                <div className='flex flex-col text-left'>
                  <span className='text-sm font-medium'>Swithc Them</span>
                </div>
              </button>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <button
              onClick={handleSignOut}
              className='text-destructive focus:bg-destructive/10 focus:text-destructive flex w-full cursor-pointer items-center gap-3 rounded-lg p-2.5'
            >
              <IconLogout size={16} />
              <span className='text-sm font-medium'>Sign out</span>
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
