import type { ReactNode } from 'react';

import { IconStar, IconTrophy } from '@tabler/icons-react';

import { Badge } from '@/components/ui/badge';
import { COMPARE_ROW_HEIGHT } from '@/domains/compare/lib/compare-constants';
import { cn } from '@/lib/utils';

interface CompareValueCellProps {
  displayValue: ReactNode;
  isBest?: boolean;
  isRating?: boolean;
}

export function CompareValueCell({ displayValue, isBest = false, isRating = false }: CompareValueCellProps) {
  return (
    <div
      className={cn(
        'border-border/40 flex flex-col items-center justify-center border-b px-4 text-center text-sm last:border-b-0',
        isBest && 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
      )}
      style={{ minHeight: COMPARE_ROW_HEIGHT }}
    >
      <div className='flex w-full flex-col items-center gap-3 py-2'>
        {isRating ? (
          <span className='inline-flex items-center gap-1 font-medium tabular-nums'>
            <IconStar className='fill-accent text-accent h-4 w-4 shrink-0' />
            {displayValue}
          </span>
        ) : (
          <span className='leading-snug font-medium break-words'>{displayValue}</span>
        )}

        {isBest && (
          <Badge
            variant='secondary'
            className='bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 shrink-0'
          >
            <IconTrophy className='mr-1 h-3 w-3' />
            Best
          </Badge>
        )}
      </div>
    </div>
  );
}
