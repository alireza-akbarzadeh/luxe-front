import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface HealthStatusBadgeProps {
  status?: string;
}

const STATUS_LABELS: Record<string, string> = {
  healthy: 'Healthy',
  degraded: 'Degraded',
  critical: 'Critical'
};

export function HealthStatusBadge({ status = 'healthy' }: HealthStatusBadgeProps) {
  const normalized = status.toLowerCase();
  return (
    <Badge
      variant='outline'
      className={cn(
        'rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase',
        normalized === 'healthy' && 'border-emerald-500/30 text-emerald-600',
        normalized === 'degraded' && 'border-amber-500/30 text-amber-600',
        normalized === 'critical' && 'border-rose-500/30 text-rose-600'
      )}
    >
      {STATUS_LABELS[normalized] ?? status}
    </Badge>
  );
}
