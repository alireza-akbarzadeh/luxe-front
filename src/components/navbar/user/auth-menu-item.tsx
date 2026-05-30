'use client';
import { IconChevronRight, IconLogout, IconUserCircle } from '@tabler/icons-react';

import { cn } from '@/lib/utils';
import { useNavbarProfile } from '~/src/components/navbar/user/useNavbarProfile';

export function AuthMenuItem() {
  const { isLoggedIn, handleLogout } = useNavbarProfile();

  return (
    <button
      onClick={isLoggedIn ? handleLogout : () => (window.location.href = '/login')}
      className={cn(
        'group hover:bg-accent/60 flex w-full cursor-pointer items-center gap-3 rounded-2xl p-3 transition-all',
        isLoggedIn && 'hover:bg-destructive/10'
      )}
    >
      <div
        className={cn(
          'bg-muted group-hover:bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl transition-colors',
          isLoggedIn && 'group-hover:bg-destructive/20'
        )}
      >
        {isLoggedIn ? (
          <IconLogout size={18} className={cn(isLoggedIn && 'text-destructive')} />
        ) : (
          <IconUserCircle size={18} className='text-foreground' />
        )}
      </div>

      <div className='flex-1 text-left'>
        <span className={cn('text-sm font-medium', isLoggedIn && 'text-destructive')}>
          {isLoggedIn ? 'Sign out' : 'Log in'}
        </span>
        <span className='text-muted-foreground block text-xs'>
          {isLoggedIn ? 'End current session' : 'Access your account'}
        </span>
      </div>

      <IconChevronRight
        size={16}
        className='text-muted-foreground transition-transform group-hover:translate-x-1'
      />
    </button>
  );
}
