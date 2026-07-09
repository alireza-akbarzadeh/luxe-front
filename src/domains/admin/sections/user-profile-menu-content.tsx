'use client';

import { IconLogout, IconSettings, IconUserCircle } from '@tabler/icons-react';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface UserProfileMenuContentProps {
  userId: string | number;
  userEmail: string;
  onSignOut: () => void | Promise<void>;
  onClose?: () => void;
  variant?: 'drawer' | 'dropdown';
}

export function UserProfileMenuContent({
  userId,
  userEmail,
  onSignOut,
  onClose,
  variant = 'dropdown'
}: UserProfileMenuContentProps) {
  const isDrawer = variant === 'drawer';

  return (
    <div className={cn(isDrawer ? 'px-2 pb-6' : 'p-2')}>
      <div className={cn('px-3 py-3', !isDrawer && 'p-3')}>
        <p className='text-muted-foreground text-xs font-medium tracking-tighter uppercase'>
          User ID: {userId}
        </p>
        <p className='text-foreground truncate text-sm font-semibold'>{userEmail}</p>
      </div>

      <div className='bg-border/60 mx-3 h-px' />

      <div className='space-y-1 p-2'>
        <ProfileMenuAction
          isDrawer={isDrawer}
          icon={<IconUserCircle size={16} />}
          title='My Profile'
          description='Work & Personal details'
          onClick={onClose}
        />
        <ProfileMenuAction
          isDrawer={isDrawer}
          icon={<IconSettings size={16} />}
          title='Preferences'
          description='Theme & System settings'
          onClick={onClose}
        />
      </div>

      <div className='bg-border/60 mx-3 my-1 h-px' />

      <div className='p-2'>
        <ProfileMenuAction
          isDrawer={isDrawer}
          icon={<IconLogout size={16} />}
          title='Sign out'
          destructive
          onClick={() => {
            onClose?.();
            void onSignOut();
          }}
        />
      </div>
    </div>
  );
}

function ProfileMenuAction({
  isDrawer,
  icon,
  title,
  description,
  destructive,
  onClick
}: {
  isDrawer: boolean;
  icon: ReactNode;
  title: string;
  description?: string;
  destructive?: boolean;
  onClick?: () => void;
}) {
  const className = cn(
    'flex w-full cursor-pointer items-center gap-3 rounded-lg p-2.5 text-left transition-colors',
    destructive
      ? 'text-destructive hover:bg-destructive/10'
      : 'hover:bg-primary/10 focus:bg-primary/10'
  );

  if (isDrawer) {
    return (
      <Button
        type='button'
        variant='ghost'
        className={cn(className, 'h-auto justify-start')}
        onClick={onClick}
      >
        <span className={cn('text-muted-foreground', destructive && 'text-destructive')}>
          {icon}
        </span>
        <span className='flex flex-col items-start'>
          <span className='text-sm font-medium'>{title}</span>
          {description ? (
            <span className='text-muted-foreground text-[10px]'>{description}</span>
          ) : null}
        </span>
      </Button>
    );
  }

  return (
    <button type='button' className={className} onClick={onClick}>
      <span className={cn('text-muted-foreground', destructive && 'text-destructive')}>{icon}</span>
      <span className='flex flex-col items-start'>
        <span className='text-sm font-medium'>{title}</span>
        {description ? (
          <span className='text-muted-foreground text-[10px]'>{description}</span>
        ) : null}
      </span>
    </button>
  );
}
