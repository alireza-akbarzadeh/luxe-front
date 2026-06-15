'use client';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
const pill = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
  {
    variants: {
      active: {
        true: 'border-gold/40 bg-gold text-gold-foreground shadow-sm',
        false: 'border-gold/20 bg-card/60 text-foreground hover:border-gold/35 hover:bg-gold/10'
      }
    },
    defaultVariants: { active: false }
  }
);
type Props = VariantProps<typeof pill> & {
  label: string;
  onClick?: () => void;
  className?: string;
};
export function CategoryPill({ label, active, onClick, className }: Props) {
  return (
    <button type='button' onClick={onClick} className={cn(pill({ active }), className)}>
      {label}
    </button>
  );
}
