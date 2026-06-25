'use client';

import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

import { getWalletStatusStyle } from '../lib/wallet-utils';

interface WalletStatusBadgeProps {
  status?: string;
  className?: string;
}

export function WalletStatusBadge({ status, className }: WalletStatusBadgeProps) {
  const t = useTranslations('account.wallet.walletStatus');
  const key = status?.toLowerCase() ?? 'unknown';
  const label = ['completed', 'pending', 'failed', 'cancelled', 'unknown'].includes(key)
    ? t(key as 'completed' | 'pending' | 'failed' | 'cancelled' | 'unknown')
    : t('unknown');

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        getWalletStatusStyle(status),
        className
      )}
    >
      {label}
    </span>
  );
}
