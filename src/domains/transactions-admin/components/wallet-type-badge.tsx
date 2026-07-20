import { cn } from '@/lib/utils';

const WALLET_TYPE_STYLES: Record<string, string> = {
  deposit:
    'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400',
  payment: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400',
  refund:
    'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-400',
  adjustment:
    'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400',
  membership:
    'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400'
};

interface WalletTypeBadgeProps {
  type?: string;
  size?: 'sm' | 'md';
}

export function WalletTypeBadge({ type, size = 'sm' }: WalletTypeBadgeProps) {
  const key = type?.toLowerCase() ?? '';
  const style = WALLET_TYPE_STYLES[key] ?? 'bg-muted text-muted-foreground border-border';
  const label = type?.replaceAll('_', ' ') ?? '—';

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-semibold capitalize',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
        style
      )}
    >
      {label}
    </span>
  );
}
