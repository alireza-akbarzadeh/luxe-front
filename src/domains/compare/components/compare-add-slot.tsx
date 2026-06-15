import { IconPlus } from '@tabler/icons-react';

import { AppDialog } from '@/components/app-dialog';
import { CompareDialogContent } from '@/domains/compare/components/compare-dialog-content';
import {
  COMPARE_ADD_COLUMN_WIDTH,
  COMPARE_PRODUCT_CARD_HEIGHT
} from '@/domains/compare/lib/compare-constants';
import { cn } from '@/lib/utils';

interface CompareAddSlotProps {
  canAddMore: boolean;
  className?: string;
}

export function CompareAddSlot({ canAddMore, className }: CompareAddSlotProps) {
  if (!canAddMore) {
    return (
      <div
        className={cn(
          'border-border/70 bg-muted/20 text-muted-foreground flex flex-col items-center justify-center rounded-2xl border border-dashed p-4 text-center text-sm',
          className
        )}
        style={{ height: COMPARE_PRODUCT_CARD_HEIGHT, width: COMPARE_ADD_COLUMN_WIDTH }}
      >
        <p className='font-medium'>Compare list full</p>
        <p className='mt-1 text-xs'>Remove an item to add another</p>
      </div>
    );
  }

  return (
    <AppDialog
      title='Add product to compare'
      trigger={
        <button
          type='button'
          className={cn(
            'border-border/70 bg-muted/20 text-muted-foreground hover:border-accent/40 hover:bg-accent/5 hover:text-foreground flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed p-4 text-sm font-medium transition-colors',
            className
          )}
          style={{ height: COMPARE_PRODUCT_CARD_HEIGHT, width: COMPARE_ADD_COLUMN_WIDTH }}
        >
          <div className='bg-background flex h-12 w-12 items-center justify-center rounded-full border shadow-sm'>
            <IconPlus className='h-5 w-5' />
          </div>
          <span>Add product</span>
        </button>
      }
    >
      <CompareDialogContent />
    </AppDialog>
  );
}
