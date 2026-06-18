import { cn } from '@/lib/utils';

type BadgeSize = 'sm' | 'md';

interface InvoiceStatusBadgeProps {
  status?: string;
  size?: BadgeSize;
}

const INVOICE_STATUS_STYLES: Record<string, string> = {
  draft: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-950/40 dark:text-slate-400',
  issued: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400',
  paid: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400',
  void: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400',
  refunded: 'bg-muted text-muted-foreground border-border'
};

function formatLabel(value?: string) {
  if (!value) return '—';
  return value.replaceAll('_', ' ');
}

export function InvoiceStatusBadge({ status, size = 'sm' }: InvoiceStatusBadgeProps) {
  const key = status?.toLowerCase() ?? '';
  const style = INVOICE_STATUS_STYLES[key] ?? 'bg-muted text-muted-foreground border-border';

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
