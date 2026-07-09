'use client';

import { IconChevronRight, IconShieldCheck } from '@tabler/icons-react';

import { AnimatePresence, motion } from '@/components/motion';
import { AppImage } from '@/components/ui/app-image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { AdminShellPanel } from '@/domains/admin/components/admin-shell-panel';
import { ADMIN_SHELL_DRAWER_MAX_WIDTH } from '@/domains/admin/lib/admin-shell-breakpoints';
import { UserProfileMenuContent } from '@/domains/admin/sections/user-profile-menu-content';
import { useAdminShellStore } from '@/domains/admin/stores/admin-shell-store';
import { useMediaDevices } from '@/hooks/useMediaDevices';
import { cn } from '@/lib/utils';
import { logoutAction } from '~/src/actions/auth.actions';
import { useUser } from '~/src/hooks/useUser';
import { clearClientAccessToken } from '~/src/lib/auth/auth-token-client';

interface UserProfileProps {
  variant?: 'sidebar' | 'header';
  isCollapsed?: boolean;
}

export function UserProfile({ variant = 'sidebar', isCollapsed = false }: UserProfileProps) {
  const isHeader = variant === 'header';
  const { width } = useMediaDevices();
  const useDrawerShell = width == null || width <= ADMIN_SHELL_DRAWER_MAX_WIDTH;
  const userMenuOpen = useAdminShellStore((state) => state.userMenuOpen);
  const setUserMenuOpen = useAdminShellStore((state) => state.setUserMenuOpen);

  const { user } = useUser();

  const userName = user?.first_name || 'Guest User';
  const userEmail = user?.email || 'guest@verc.com';
  const userRole = user?.role || 'USER';
  const userId = user?.id || 'GUEST';
  const avatarUrl = `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(userName)}&backgroundColor=d4af37&textColor=ffffff`;

  const handleSignOut = async () => {
    clearClientAccessToken();
    await logoutAction();
  };

  const triggerButton = (
    <button
      type='button'
      className={cn(
        'group flex items-center rounded-xl border border-transparent transition-all duration-200 outline-none',
        isHeader
          ? 'p-0.5 hover:opacity-80'
          : 'hover:bg-accent/50 hover:border-border/50 w-full gap-3 p-2',
        !isHeader && isCollapsed && 'justify-center px-0'
      )}
    >
      <div className='relative shrink-0'>
        <AppImage
          src={avatarUrl}
          alt={userName}
          width={isHeader ? 32 : 36}
          height={isHeader ? 32 : 36}
          className={cn(
            'ring-border/60 rounded-full object-cover ring-1',
            isHeader ? 'size-8' : 'size-9'
          )}
          unoptimized
        />
        {!isHeader ? (
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
        ) : null}
      </div>

      {isHeader ? (
        <div className='hidden min-w-0 flex-col items-start text-left md:flex'>
          <span className='truncate text-sm font-medium'>{userName}</span>
          <span className='text-muted-foreground truncate text-[11px] capitalize'>
            {userRole.replace('_', ' ')}
          </span>
        </div>
      ) : null}

      {isHeader ? <IconChevronRight size={14} className='hidden opacity-60 md:inline' /> : null}

      {!isHeader ? (
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
      ) : null}

      {!isHeader && !isCollapsed ? (
        <IconChevronRight
          size={14}
          className='text-muted-foreground group-hover:text-foreground transition-all group-data-[state=open]:rotate-90'
        />
      ) : null}
    </button>
  );

  const menuContent = (
    <UserProfileMenuContent
      userId={userId}
      userEmail={userEmail}
      onSignOut={handleSignOut}
      onClose={isHeader ? () => setUserMenuOpen(false) : undefined}
      variant={useDrawerShell && isHeader ? 'drawer' : 'dropdown'}
    />
  );

  return (
    <div
      className={cn(
        'transition-all duration-300',
        isHeader ? 'flex items-center' : isCollapsed ? 'p-2' : 'p-4'
      )}
    >
      {isHeader ? (
        <AdminShellPanel
          open={userMenuOpen}
          onOpenChange={setUserMenuOpen}
          title={userName}
          desktopSurface='dropdown'
          dropdownClassName='border-border/50 bg-popover/95 w-64 rounded-2xl shadow-xl backdrop-blur-md'
          trigger={triggerButton}
        >
          {menuContent}
        </AdminShellPanel>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>{triggerButton}</DropdownMenuTrigger>
          <DropdownMenuContent
            className='border-border/50 bg-popover/95 w-64 rounded-2xl p-2 shadow-xl backdrop-blur-md'
            side={isCollapsed ? 'right' : 'top'}
            align='center'
            sideOffset={12}
          >
            {menuContent}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
