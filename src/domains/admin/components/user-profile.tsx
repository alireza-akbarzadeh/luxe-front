import {
  IconChevronRight,
  IconLogout,
  IconSettings,
  IconShieldCheck,
  IconUserCircle
} from '@tabler/icons-react';
import Image from 'next/image';

import { AnimatePresence, motion } from '@/components/motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { logoutAction } from '~/src/actions/auth.actions';
import { useUser } from '~/src/hooks/useUser';

interface UserProfileProps {
  variant?: 'sidebar' | 'header';
  isCollapsed?: boolean; // Only used for sidebar
}

export function UserProfile({ variant = 'sidebar', isCollapsed = false }: UserProfileProps) {
  const isHeader = variant === 'header';

  // Get real user data from auth context
  const { user } = useUser();

  // Fallback values if no user is logged in
  const avatarSeed = user?.email || 'Guest';
  const userName = user?.first_name || 'Guest User';
  const userEmail = user?.email || 'guest@verc.com';
  const userRole = user?.role || 'USER';
  const userId = user?.id || 'GUEST';

  const handleSignOut = async () => {
    await logoutAction();
  };

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
              'group flex items-center rounded-xl border border-transparent transition-all duration-200 outline-none',
              isHeader
                ? 'p-0.5 hover:opacity-80' // Minimal style for header
                : 'hover:bg-accent/50 hover:border-border/50 w-full gap-3 p-2',
              !isHeader && isCollapsed && 'justify-center px-0'
            )}
          >
            {/* Avatar Section */}
            <div className='relative shrink-0'>
              <Image
                alt={userName}
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`}
                className={cn(
                  'ring-border group-hover:ring-primary/50 rounded-lg object-cover shadow-sm ring-1 transition-all',
                  isHeader ? 'h-8 w-8' : 'h-9 w-9'
                )}
              />
              {/* Animated Status Indicator */}
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

            {/* Name and Role - ONLY for Sidebar (and only if not collapsed) */}
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

            {/* Chevron - ONLY for Sidebar (and only if not collapsed) */}
            {!isHeader && !isCollapsed && (
              <IconChevronRight
                size={14}
                className='text-muted-foreground group-hover:text-foreground transition-all group-data-[state=open]:rotate-90'
              />
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className='border-border/50 bg-popover/95 w-64 rounded-2xl p-2 shadow-xl backdrop-blur-md'
          // Side logic: Header drops down, Sidebar drops up/right
          side={isHeader ? 'bottom' : isCollapsed ? 'right' : 'top'}
          align={isHeader ? 'end' : 'center'}
          sideOffset={12}
        >
          <DropdownMenuLabel className='p-3'>
            <div className='flex flex-col gap-1'>
              <p className='text-muted-foreground text-xs font-medium tracking-tighter uppercase'>
                User ID: {userId}
              </p>
              <p className='text-foreground truncate text-sm font-semibold'>{userEmail}</p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <div className='space-y-0.5 p-1'>
            <DropdownMenuItem className='focus:bg-primary/10 focus:text-primary group flex cursor-pointer items-center gap-3 rounded-lg p-2.5'>
              <IconUserCircle
                size={16}
                className='text-muted-foreground group-focus:text-primary'
              />
              <div className='flex flex-col'>
                <span className='text-sm font-medium'>My Profile</span>
                <span className='text-muted-foreground text-[10px]'>Work & Personal details</span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem className='focus:bg-primary/10 focus:text-primary group flex cursor-pointer items-center gap-3 rounded-lg p-2.5'>
              <IconSettings size={16} className='text-muted-foreground group-focus:text-primary' />
              <div className='flex flex-col'>
                <span className='text-sm font-medium'>Preferences</span>
                <span className='text-muted-foreground text-[10px]'>Theme & System settings</span>
              </div>
            </DropdownMenuItem>
          </div>

          <DropdownMenuSeparator />

          <div className='p-1'>
            <DropdownMenuItem
              onClick={handleSignOut}
              className='text-destructive focus:bg-destructive/10 focus:text-destructive flex cursor-pointer items-center gap-3 rounded-lg p-2.5'
            >
              <IconLogout size={16} />
              <span className='text-sm font-medium'>Sign out</span>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
