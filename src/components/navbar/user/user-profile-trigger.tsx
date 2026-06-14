'use client';

import { IconUser } from '@tabler/icons-react';
import { type ComponentPropsWithoutRef,forwardRef } from 'react';

import { navbarActionButtonClassName } from '@/components/navbar/navbar-action-button';
import { useNavbarProfile } from '@/components/navbar/user/useNavbarProfile';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type UserProfileTriggerProps = ComponentPropsWithoutRef<'button'>;

export const UserProfileTrigger = forwardRef<HTMLButtonElement, UserProfileTriggerProps>(
  function UserProfileTrigger({ className, ...props }, ref) {
    const { avatarFallback, statusDot, isLoggedIn } = useNavbarProfile();

    return (
      <Button
        ref={ref}
        type='button'
        variant='ghost'
        size='icon'
        aria-label='Account menu'
        className={cn(
          navbarActionButtonClassName,
          'hover:bg-muted/70 relative p-0',
          'focus-visible:ring-gold/40',
          className
        )}
        {...props}
      >
        <span
          className={cn(
            'flex size-9 items-center justify-center rounded-full ring-1 transition-colors',
            isLoggedIn
              ? 'from-gold via-accent to-gold-strong text-gold-foreground ring-gold/25 bg-linear-to-br shadow-sm'
              : 'bg-muted text-muted-foreground ring-border/80'
          )}
        >
          {isLoggedIn ? (
            <span className='font-display text-xs leading-none font-semibold'>
              {avatarFallback}
            </span>
          ) : (
            <IconUser className='size-4' stroke={1.75} />
          )}
        </span>

        <span
          className={cn(
            'border-background absolute right-0.5 bottom-0.5 size-2 rounded-full border-2',
            statusDot
          )}
          aria-hidden
        />
      </Button>
    );
  }
);

UserProfileTrigger.displayName = 'UserProfileTrigger';
