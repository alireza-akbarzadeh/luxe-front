import { cn } from '@/lib/utils';

type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  status?: string;
  size?: BadgeSize;
}

const ORDER_STATUS_STYLES: Record<string, string> = {
  pending:
    'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-400',
  paid: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400',
  shipped: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400',
  delivered:
    'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400',
  delayed:
    'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400',
  cancelled: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400',
  refunded: 'bg-muted text-muted-foreground border-border'
};

const PAYMENT_STATUS_STYLES: Record<string, string> = {
  completed:
    'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400',
  succeeded:
    'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400',
  paid: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400',
  pending: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400',
  failed: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400',
  refunded: 'bg-muted text-muted-foreground border-border',
  partial: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400'
};

const SHIPMENT_STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400',
  shipped: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400',
  delivered:
    'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400'
};

function formatLabel(value?: string) {
  if (!value) return '—';
  return value.replaceAll('_', ' ');
}

function StatusBadge({
  status,
  styles,
  size = 'sm'
}: BadgeProps & { styles: Record<string, string> }) {
  const key = status?.toLowerCase() ?? '';
  const style = styles[key] ?? 'bg-muted text-muted-foreground border-border';

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-semibold capitalize',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
        style
      )}
    >
      {formatLabel(status)}
    </span>
  );
}

export function ApiOrderStatusBadge({ status, size }: BadgeProps) {
  return <StatusBadge status={status} size={size} styles={ORDER_STATUS_STYLES} />;
}

export function ApiPaymentStatusBadge({ status, size }: BadgeProps) {
  return <StatusBadge status={status} size={size} styles={PAYMENT_STATUS_STYLES} />;
}

export function ApiShipmentStatusBadge({ status, size }: BadgeProps) {
  return <StatusBadge status={status} size={size} styles={SHIPMENT_STATUS_STYLES} />;
}
