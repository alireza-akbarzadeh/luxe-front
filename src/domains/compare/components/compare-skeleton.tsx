import { Skeleton } from '~/src/components/ui/skeleton';

export function CompareSkeleton() {
  return (
    <div className='mx-auto max-w-7xl px-4 py-8 pt-24'>
      <Skeleton className='h-8 w-48' />
      <div className='mt-8 flex gap-4'>
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className='h-80 w-full' />
        ))}
      </div>
    </div>
  );
}
