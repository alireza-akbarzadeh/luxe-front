import { Skeleton } from '@/components/ui/skeleton';

interface ProductGridSkeletonProps {
  count?: number;
  columns?: 2 | 4 | 6;
}

export function ProductGridSkeleton({ count = 8, columns = 4 }: ProductGridSkeletonProps) {
  const gridClass =
    columns === 6
      ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'
      : columns === 4
        ? 'grid-cols-2 lg:grid-cols-4'
        : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';

  return (
    <div className={`grid gap-4 sm:gap-6 ${gridClass}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className='space-y-3'>
          <Skeleton className='aspect-4/5 w-full rounded-xl' />
          <Skeleton className='h-3 w-1/3' />
          <Skeleton className='h-4 w-4/5' />
          <Skeleton className='h-3 w-1/2' />
        </div>
      ))}
    </div>
  );
}
