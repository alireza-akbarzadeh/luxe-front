'use client';

import { useTranslations } from 'next-intl';

import { useNavbarProfile } from '@/components/navbar/user/useNavbarProfile';
import { PlusMembershipBadge } from '@/domains/plus/components/plus-membership-badge';
import { cn } from '@/lib/utils';

export function UserProfileHeader() {
  const t = useTranslations('nav.userProfile');
  const { avatarFallback, userName, userEmail, sessionDot, isLoggedIn } = useNavbarProfile();

  return (
    <div className='border-border from-gold/10 via-background to-background relative overflow-hidden border-b bg-linear-to-br p-5'>
      <div className='bg-gold/15 pointer-events-none absolute -top-16 -right-10 size-40 rounded-full blur-3xl' />

      <div className='relative flex items-center gap-4'>
        <div
          className={cn(
            'flex size-14 shrink-0 items-center justify-center rounded-2xl text-lg font-semibold shadow-sm ring-1 sm:size-16 sm:text-xl',
            isLoggedIn
              ? 'from-gold via-accent to-gold-strong text-gold-foreground ring-gold/25 bg-linear-to-br'
              : 'bg-muted text-muted-foreground ring-border'
          )}
        >
          {avatarFallback}
        </div>

        <div className='min-w-0 flex-1'>
          <h3 className='font-display truncate text-base font-semibold sm:text-lg'>{userName}</h3>
          <p className='text-muted-foreground truncate text-sm'>{userEmail}</p>

          <div className='bg-muted/60 ring-border/60 mt-2 inline-flex flex-wrap items-center gap-2'>
            <span className='inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs ring-1'>
              <span className={cn('size-2 rounded-full', sessionDot)} />
              {isLoggedIn ? t('signedIn') : t('guestSession')}
            </span>
            {isLoggedIn ? <PlusMembershipBadge /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
