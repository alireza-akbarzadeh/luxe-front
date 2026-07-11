import type { ReactNode } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type SectionSkeletonShellProps = {
  children: ReactNode;
  className?: string;
  /** Vertical padding preset — carousel sections use SectionCarousel spacing. */
  padding?: 'carousel' | 'marquee';
};

/** Matches storefront section width (`app-container`) and vertical rhythm. */
function SectionSkeletonShell({
  children,
  className,
  padding = 'carousel'
}: SectionSkeletonShellProps) {
  return (
    <section
      className={cn(
        padding === 'carousel' ? 'py-16 sm:py-20 lg:py-28' : 'py-8 sm:py-10 lg:py-12',
        className
      )}
    >
      <div className='app-container'>{children}</div>
    </section>
  );
}

function SectionHeaderSkeleton() {
  return (
    <div className='mb-8 flex items-end justify-between gap-4 md:mb-10'>
      <div className='min-w-0 space-y-2'>
        <Skeleton className='h-4 w-24' />
        <Skeleton className='h-9 w-64 max-w-full sm:h-10' />
        <Skeleton className='h-4 w-96 max-w-full' />
      </div>
      <Skeleton className='hidden h-4 w-20 shrink-0 lg:block' />
    </div>
  );
}

type CarouselSkeletonProps = {
  count?: number;
  aspect?: string;
  columns?: { mobile?: number; tablet?: number; desktop?: number };
  className?: string;
};

export function CarouselSkeleton({
  count = 4,
  aspect = 'aspect-[0.78]',
  columns = { mobile: 1, tablet: 2, desktop: 4 },
  className
}: CarouselSkeletonProps) {
  const { mobile = 1, tablet = 2, desktop = 4 } = columns;

  return (
    <SectionSkeletonShell className={className}>
      <SectionHeaderSkeleton />
      <div
        className={cn(
          'grid gap-3 sm:gap-4',
          mobile === 1 && 'grid-cols-1',
          mobile === 2 && 'grid-cols-2',
          tablet === 1 && 'sm:grid-cols-1',
          tablet === 2 && 'sm:grid-cols-2',
          tablet === 3 && 'sm:grid-cols-3',
          tablet === 4 && 'sm:grid-cols-4',
          desktop === 2 && 'lg:grid-cols-2',
          desktop === 3 && 'lg:grid-cols-3',
          desktop === 4 && 'lg:grid-cols-4',
          desktop === 6 && 'lg:grid-cols-6'
        )}
      >
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} className={cn('w-full rounded-2xl', aspect)} />
        ))}
      </div>
    </SectionSkeletonShell>
  );
}

type CardGridSkeletonProps = {
  count?: number;
  aspect?: string;
  className?: string;
};

/** Product-style grid inside the same section shell as carousel blocks. */
export function CardGridSkeleton({
  count = 8,
  aspect = 'aspect-4/5',
  className
}: CardGridSkeletonProps) {
  return (
    <SectionSkeletonShell className={className}>
      <SectionHeaderSkeleton />
      <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4'>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className='space-y-3'>
            <Skeleton className={cn('w-full rounded-xl', aspect)} />
            <Skeleton className='h-3 w-1/3' />
            <Skeleton className='h-4 w-4/5' />
            <Skeleton className='h-3 w-1/2' />
          </div>
        ))}
      </div>
    </SectionSkeletonShell>
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
    <SectionSkeletonShell padding='marquee' className={className}>
      <div className='luxury-glass overflow-hidden rounded-[1.75rem] border border-white/8 py-5 sm:rounded-[2rem] sm:py-6'>
        <div className='flex items-center gap-8 overflow-hidden px-4'>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className='h-12 w-32 shrink-0 rounded-lg' />
          ))}
        </div>
      </div>
    </SectionSkeletonShell>
  );
}
