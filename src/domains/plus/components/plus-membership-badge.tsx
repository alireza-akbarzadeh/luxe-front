'use client';

import { IconCrown } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { useAuth } from '@/components/providers/auth-provider';
import { Badge } from '@/components/ui/badge';
import { usePlusMembershipQuery } from '@/domains/plus/hooks/use-plus-membership';
import { cn } from '@/lib/utils';

type PlusMembershipBadgeProps = {
  className?: string;
  size?: 'sm' | 'md';
};

/** Tier badge for profile header and account surfaces. */
export function PlusMembershipBadge({ className, size = 'sm' }: PlusMembershipBadgeProps) {
  const t = useTranslations('plus.badge');
  const { isAuthenticated } = useAuth();
  const { data, isLoading } = usePlusMembershipQuery();

  const isPlus = data?.data?.is_plus_active === true;

  if (!isAuthenticated) {
    return (
      <Badge variant='secondary' className={cn('rounded-full', className)}>
        {t('guest')}
      </Badge>
    );
  }

  if (isLoading) {
    return (
      <Badge variant='secondary' className={cn('rounded-full opacity-60', className)}>
        …
      </Badge>
    );
  }

  if (isPlus) {
    return (
      <Badge
        className={cn(
          'from-gold via-gold-strong to-gold gap-1 rounded-full border-0 bg-linear-to-r text-amber-950',
          size === 'md' && 'px-3 py-1 text-xs',
          className
        )}
      >
        <IconCrown className='size-3.5' aria-hidden />
        {t('plus')}
      </Badge>
    );
  }

  return (
    <Badge variant='secondary' className={cn('rounded-full', className)}>
      {t('free')}
    </Badge>
  );
}
