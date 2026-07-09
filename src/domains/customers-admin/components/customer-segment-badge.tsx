import { Badge } from '@/components/ui/badge';
import { customerSegmentLabel } from '@/domains/customers-admin/lib/customer-segments';
import { cn } from '@/lib/utils';

const SEGMENT_STYLES: Record<string, string> = {
  vip: 'border-amber-500/30 bg-amber-500/10 text-amber-700',
  loyal: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700',
  new: 'border-sky-500/30 bg-sky-500/10 text-sky-700',
  at_risk: 'border-rose-500/30 bg-rose-500/10 text-rose-700'
};

interface CustomerSegmentBadgeProps {
  segment?: string;
}

export function CustomerSegmentBadge({ segment }: CustomerSegmentBadgeProps) {
  if (!segment) {
    return (
      <Badge variant='outline' className='text-muted-foreground text-[10px] font-bold uppercase'>
        Unassigned
      </Badge>
    );
  }

  return (
    <Badge
      variant='outline'
      className={cn('text-[10px] font-bold uppercase', SEGMENT_STYLES[segment])}
    >
      {customerSegmentLabel(segment)}
    </Badge>
  );
}
