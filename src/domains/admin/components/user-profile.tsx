'use client';

import { IconChevronRight, IconShieldCheck } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { AnimatePresence, motion } from '@/components/motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { AccountUserAvatar } from '@/domains/account/components/account-user-avatar';
import { AdminShellPanel } from '@/domains/admin/components/admin-shell-panel';
import { ADMIN_SHELL_DRAWER_MAX_WIDTH } from '@/domains/admin/lib/admin-shell-breakpoints';
import { UserProfileMenuContent } from '@/domains/admin/sections/user-profile-menu-content';
import { useAdminShellStore } from '@/domains/admin/stores/admin-shell-store';
import { useMediaDevices } from '@/hooks/useMediaDevices';
import { useUser } from '@/hooks/useUser';
import { cn } from '@/lib/utils';
import { logoutAction } from '~/src/actions/auth.actions';
import { clearClientAccessToken } from '~/src/lib/auth/auth-token-client';

interface UserProfileProps {
  variant?: 'sidebar' | 'header';
  isCollapsed?: boolean;
}

function formatRoleLabel(role?: string | null) {
  if (!role) return 'User';

  return role
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function resolveDisplayName(
  user: ReturnType<typeof useUser>['user'],
  guestLabel: string
): string {
  if (!user) return guestLabel;

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ').trim();
  if (fullName) return fullName;

  if (user.email) {
    const localPart = user.email.split('@')[0]?.trim();
    if (localPart) return localPart;
  }

  return guestLabel;
}

function UserProfileSkeleton({
  isHeader,
  isCollapsed
}: {
  isHeader: boolean;
  isCollapsed: boolean;
}) {
  if (isHeader) {
    return (
      <div
        className='flex items-center gap-3 rounded-lg px-1 py-0.5 md:px-2'
        aria-busy='true'
        aria-label='Loading account'
      >
        <Skeleton className='size-8 shrink-0 rounded-full' />
        <div className='hidden min-w-0 flex-col gap-1.5 md:flex'>
          <Skeleton className='h-3.5 w-24' />
          <Skeleton className='h-3 w-16' />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center rounded-xl p-2',
        isCollapsed ? 'justify-center' : 'gap-3'
      )}
      aria-busy='true'
      aria-label='Loading account'
    >
      <Skeleton className='size-9 shrink-0 rounded-full' />
      {!isCollapsed ? (
        <div className='flex min-w-0 flex-1 flex-col gap-1.5'>
          <Skeleton className='h-3.5 w-28' />
          <Skeleton className='h-3 w-20' />
        </div>
      ) : null}
    </div>
  );
}

export function UserProfile({ variant = 'sidebar', isCollapsed = false }: UserProfileProps) {
  const t = useTranslations('adminShell.userProfile');
  const isHeader = variant === 'header';
  const { width } = useMediaDevices();
  const useDrawerShell = width == null || width <= ADMIN_SHELL_DRAWER_MAX_WIDTH;
  const userMenuOpen = useAdminShellStore((state) => state.userMenuOpen);
  const setUserMenuOpen = useAdminShellStore((state) => state.setUserMenuOpen);

  const { user, loading, isAuthenticated } = useUser();

  const isLoggedIn = isAuthenticated && Boolean(user);
  const userName = loading ? t('loading') : resolveDisplayName(user, t('guestUser'));
  const userEmail = isLoggedIn ? (user?.email ?? t('guestEmail')) : t('guestEmail');
  const userRole = formatRoleLabel(user?.role);
  const userId = user?.id ?? 'GUEST';

  const handleSignOut = async () => {
    clearClientAccessToken();
    await logoutAction();
  };

  if (loading) {
    return (
      <div className={cn('transition-all duration-300', isHeader ? 'flex items-center' : isCollapsed ? 'p-2' : 'p-4')}>
        <UserProfileSkeleton isHeader={isHeader} isCollapsed={isCollapsed} />
      </div>
    );
  }

  const triggerButton = (
    <button
      type='button'
      aria-label={t('openMenu')}
      className={cn(
        'group flex items-center rounded-xl border border-transparent transition-all duration-200 outline-none',
        isHeader
          ? 'hover:bg-muted/50 gap-3 rounded-lg px-1.5 py-1 md:px-2'
          : 'hover:bg-accent/50 hover:border-border/50 w-full gap-3 p-2',
        !isHeader && isCollapsed && 'justify-center px-0'
      )}
    >
      <div className='relative shrink-0'>
        <AccountUserAvatar
          avatarUrl={user?.avatar_url}
          firstName={user?.first_name}
          lastName={user?.last_name}
          sizeClassName={isHeader ? 'size-8' : 'size-9'}
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
        <div className='hidden min-w-0 flex-col items-start gap-0.5 text-left md:flex'>
          <span className='max-w-[9rem] truncate text-sm leading-none font-medium lg:max-w-[11rem]'>
            {userName}
          </span>
          <span className='text-muted-foreground truncate text-[11px] leading-none'>
            {userRole}
          </span>
        </div>
      ) : null}

      {isHeader ? (
        <IconChevronRight size={14} className='text-muted-foreground hidden shrink-0 opacity-60 md:inline' />
      ) : null}

      {!isHeader ? (
        <AnimatePresence mode='wait'>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className='flex min-w-0 flex-1 flex-col items-start gap-1'
            >
              <p className='text-foreground w-full truncate text-left text-sm leading-none font-semibold'>
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
          className='text-muted-foreground group-hover:text-foreground shrink-0 transition-all group-data-[state=open]:rotate-90'
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
