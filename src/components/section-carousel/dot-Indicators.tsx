import { cn } from '~/src/lib/utils';

// ── Dot indicators ───────────────────────────────────────────────────────────
export function DotIndicators({
  count,
  active,
  onDotClick
}: {
  count: number;
  active: number;
  onDotClick: (i: number) => void;
}) {
  return (
    <div className='flex items-center gap-2' aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type='button'
          onClick={() => onDotClick(i)}
          className={cn(
            'rounded-full transition-all duration-300',
            i === active
              ? 'bg-foreground h-1.5 w-6'
              : 'bg-foreground/20 hover:bg-foreground/40 h-1.5 w-1.5'
          )}
        />
      ))}
    </div>
  );
}
