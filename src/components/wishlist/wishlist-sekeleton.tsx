import { Flex } from '@/components/ui/flex';
import { Skeleton } from '@/components/ui/skeleton';

export function WishlistSheetSkeleton() {
  return (
    <div className='flex-1 overflow-y-auto px-6 py-2'>
      <div className='divide-border divide-y'>
        {[1, 2, 3].map((i) => (
          <Flex key={i} spacing={4} className='py-4'>
            <Skeleton className='h-24 w-20 shrink-0 rounded-xl' />
            <Flex direction='column' className='min-w-0 flex-1'>
              <Flex align='start' justify='between' spacing={2}>
                <Flex direction='column' spacing={2} className='min-w-0 flex-1'>
                  <Skeleton className='h-4 w-3/4' />
                  <Skeleton className='h-4 w-1/2' />
                  <Flex align='center' spacing={2}>
                    <Skeleton className='h-4 w-14' />
                    <Skeleton className='h-3 w-10' />
                  </Flex>
                </Flex>
                <Skeleton className='size-8 shrink-0 rounded-full' />
              </Flex>
              <div className='mt-auto pt-3'>
                <Skeleton className='h-8 w-28 rounded-full' />
              </div>
            </Flex>
          </Flex>
        ))}
      </div>
    </div>
  );
}
