import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const STATUS_STYLES: Record<string, string> = {
  open: 'bg-sky-500/15 text-sky-700 dark:text-sky-300',
  pending: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  waiting_customer: 'bg-violet-500/15 text-violet-700 dark:text-violet-300',
  resolved: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  closed: 'bg-muted text-muted-foreground'
};

const STATUS_LABELS: Record<string, string> = {
  open: 'Open',
  pending: 'Pending',
  waiting_customer: 'Waiting customer',
  resolved: 'Resolved',
  closed: 'Closed'
};

interface SupportStatusBadgeProps {
  status?: string;
  className?: string;
}

export function SupportStatusBadge({ status, className }: SupportStatusBadgeProps) {
  const key = status ?? 'open';
  return (
    <Badge variant='outline' className={cn('border-0 font-medium', STATUS_STYLES[key], className)}>
      {STATUS_LABELS[key] ?? key}
    </Badge>
  );
}
