// components/section-skeletons.tsx
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type CarouselSkeletonProps = {
  count?: number;
  aspect?: string;
  columns?: { mobile?: number; tablet?: number; desktop?: number };
  className?: string;
};

export function CarouselSkeleton({
  count = 8,
  aspect = 'aspect-[0.78]',
  columns = { mobile: 2, tablet: 3, desktop: 4 },
  className
}: CarouselSkeletonProps) {
  return (
    <div className={cn('border-border/40 border-b py-10 sm:py-12 lg:py-16', className)}>
      <div className='mb-6 space-y-2 px-4 sm:px-6 lg:px-8'>
        <Skeleton className='h-4 w-24' />
        <Skeleton className='h-8 w-64' />
        <Skeleton className='h-4 w-96 max-w-full' />
      </div>
      <div
        className={cn(
          'grid gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8',
          columns.mobile === 2 && 'grid-cols-2',
          columns.mobile === 3 && 'grid-cols-3',
          columns.tablet === 3 && 'sm:grid-cols-3',
          columns.tablet === 4 && 'sm:grid-cols-4',
          columns.desktop === 4 && 'lg:grid-cols-4',
          columns.desktop === 6 && 'lg:grid-cols-6'
        )}
      >
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} className={cn('w-full rounded-3xl', aspect)} />
        ))}
      </div>
    </div>
  );
}

type CardGridSkeletonProps = {
  count?: number;
  aspect?: string;
  className?: string;
};

export function CardGridSkeleton({
  count = 8,
  aspect = 'aspect-square',
  className
}: CardGridSkeletonProps) {
  return (
    <div className={cn('grid grid-cols-2 gap-3 py-8 sm:grid-cols-4 sm:gap-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={cn('w-full rounded-2xl', aspect)} />
      ))}
    </div>
  );
}

/** Placeholder for deferred hero editorial panel — reserves space to limit CLS. */
export function HeroEditorialPanelSkeleton() {
  return (
    <div
      aria-hidden
      className='border-gold/25 bg-card/75 min-h-[22rem] rounded-3xl border p-6 sm:min-h-[24rem] sm:p-8'
    />
  );
}

export function MarqueeSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-8 overflow-hidden py-8', className)}>
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className='h-12 w-32 shrink-0 rounded-lg' />
      ))}
    </div>
  );
}
