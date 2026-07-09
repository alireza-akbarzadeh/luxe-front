'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ReturnTypeBadgeProps {
  returnType?: string;
  className?: string;
}

export function ReturnTypeBadge({ returnType = 'refund', className }: ReturnTypeBadgeProps) {
  const isExchange = returnType === 'exchange';

  return (
    <Badge
      variant='outline'
      className={cn(
        'text-[10px] font-semibold tracking-wide uppercase',
        isExchange ? 'border-violet-500/40 text-violet-600 dark:text-violet-400' : '',
        className
      )}
    >
      {isExchange ? 'Exchange' : 'Refund'}
    </Badge>
  );
}
