import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const ACTION_STYLES: Record<string, string> = {
  POST: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30',
  PUT: 'bg-blue-500/15 text-blue-700 border-blue-500/30',
  PATCH: 'bg-amber-500/15 text-amber-700 border-amber-500/30',
  DELETE: 'bg-red-500/15 text-red-700 border-red-500/30'
};

interface AuditActionBadgeProps {
  action: string;
  className?: string;
}

export function AuditActionBadge({ action, className }: AuditActionBadgeProps) {
  const normalized = action.toUpperCase();
  return (
    <Badge
      variant='outline'
      className={cn(
        'font-mono text-[10px] font-bold tracking-wider uppercase',
        ACTION_STYLES[normalized] ?? 'bg-muted text-muted-foreground',
        className
      )}
    >
      {normalized}
    </Badge>
  );
}

export const AUDIT_ACTION_OPTIONS = ['POST', 'PUT', 'PATCH', 'DELETE'] as const;
