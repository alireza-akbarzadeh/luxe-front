import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface LoyaltyBadgeProps {
  tier?: string;
  isPlusActive?: boolean;
}

export function LoyaltyBadge({ tier, isPlusActive }: LoyaltyBadgeProps) {
  const isPlus = tier === 'plus' && isPlusActive;

  return (
    <Badge
      variant='outline'
      className={cn(
        'text-[10px] font-bold uppercase',
        isPlus
          ? 'border-violet-500/40 bg-violet-500/10 text-violet-700'
          : 'text-muted-foreground border-border/60'
      )}
    >
      {isPlus ? 'Luxe Plus' : 'Free'}
    </Badge>
  );
}
