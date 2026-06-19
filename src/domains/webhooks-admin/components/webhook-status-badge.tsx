import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const STATUS_STYLES: Record<string, string> = {
  received: 'bg-blue-500/15 text-blue-700 border-blue-500/30',
  processed: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30',
  failed: 'bg-red-500/15 text-red-700 border-red-500/30'
};

interface WebhookStatusBadgeProps {
  status: string;
  className?: string;
}

export function WebhookStatusBadge({ status, className }: WebhookStatusBadgeProps) {
  const normalized = status.toLowerCase();

  return (
    <Badge
      variant='outline'
      className={cn(
        'text-[10px] font-bold tracking-wider uppercase',
        STATUS_STYLES[normalized] ?? 'bg-muted text-muted-foreground',
        className
      )}
    >
      {normalized}
    </Badge>
  );
}
