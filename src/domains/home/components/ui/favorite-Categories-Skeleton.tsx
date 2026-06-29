import { Skeleton } from '@/components/ui/skeleton';

export function FavoriteCategoriesSkeleton() {
  return (
    <>
      {/* Mobile: horizontal strip */}
      <div
        className='flex gap-4 overflow-x-auto px-4 pb-3 lg:hidden'
        style={{
          marginLeft: '-1rem',
          marginRight: '-1rem',
          paddingLeft: '1rem',
          paddingRight: '1rem'
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className='flex w-[4.5rem] shrink-0 flex-col items-center gap-2.5 sm:w-24'>
            <Skeleton className='size-[4.5rem] rounded-full sm:size-20' />
            <Skeleton className='h-2.5 w-14 rounded-full' />
          </div>
        ))}
      </div>

      {/* Desktop: 4-col grid */}
      <div className='hidden grid-cols-4 gap-6 lg:grid'>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className='flex flex-col items-center gap-3'>
            <Skeleton className='size-24 rounded-full' />
            <Skeleton className='h-3 w-20 rounded-full' />
          </div>
        ))}
      </div>
    </>
  );
}
