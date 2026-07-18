import { Flex } from '@/components/ui/flex';
import { Skeleton } from '@/components/ui/skeleton';

export default function CalendarHolidaysLoading() {
  return (
    <Flex direction='column' spacing={4}>
      <Skeleton className='h-10 w-full' />
      <Skeleton className='h-[480px] w-full rounded-xl' />
    </Flex>
  );
}
