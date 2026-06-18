import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface AdminSidebarSkeletonProps {
  isCollapsed?: boolean;
}

/**
 * Placeholder nav while `/user/menu/structure` is loading.
 */
export function AdminSidebarSkeleton({ isCollapsed = false }: AdminSidebarSkeletonProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-6 pb-8',
        isCollapsed ? 'items-center px-1' : 'px-2'
      )}
    >
      {Array.from({ length: 4 }).map((_, groupIndex) => (
        <div key={groupIndex} className='w-full space-y-2'>
          {!isCollapsed ? <Skeleton className='mx-3 h-3 w-24' /> : null}
          <div className='space-y-1'>
            {Array.from({ length: groupIndex === 0 ? 2 : 3 }).map((__, itemIndex) => (
              <Skeleton
                key={itemIndex}
                className={cn(
                  'h-9 rounded-lg',
                  isCollapsed ? 'mx-auto w-10' : 'mx-1 w-[calc(100%-0.5rem)]'
                )}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
