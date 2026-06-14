import { cn } from '@/lib/utils';

import { formatWalletStatus, getWalletStatusStyle } from '../lib/wallet-utils';

interface WalletStatusBadgeProps {
  status?: string;
  className?: string;
}

export function WalletStatusBadge({ status, className }: WalletStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        getWalletStatusStyle(status),
        className
      )}
    >
      {formatWalletStatus(status)}
    </span>
  );
}
