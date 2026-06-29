import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

import { cn } from '~/src/lib/utils';

// ── Chevron button (reuse same shape as testimonials) ────────────────────────
export function ChevronButton({
  direction,
  onClick,
  disabled
}: {
  direction: 'prev' | 'next';
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'prev' ? 'Previous' : 'Next'}
      className={cn(
        'border-border/60 bg-card flex size-9 items-center justify-center rounded-full border shadow-sm transition-all duration-200',
        disabled
          ? 'text-muted-foreground/30 cursor-not-allowed opacity-40'
          : 'text-foreground hover:border-border hover:shadow-md active:scale-95'
      )}
    >
      {direction === 'prev' ? (
        <IconChevronLeft className='size-4' stroke={1.75} />
      ) : (
        <IconChevronRight className='size-4' stroke={1.75} />
      )}
    </button>
  );
}
