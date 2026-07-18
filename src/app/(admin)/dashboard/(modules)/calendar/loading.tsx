import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { Skeleton } from '@/components/ui/skeleton';

export default function CalendarLoading() {
  return (
    <Flex direction='column' spacing={6}>
      <Flex direction='column' spacing={2}>
        <Skeleton className='h-8 w-72' />
        <Skeleton className='h-4 w-96 max-w-full' />
      </Flex>

      <Grid cols={1} gap={4} className='sm:grid-cols-2 xl:grid-cols-6'>
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className='h-24 rounded-xl' />
        ))}
      </Grid>

      <Skeleton className='h-[520px] w-full rounded-xl' />

      <Grid cols={1} gap={4} className='sm:grid-cols-2 lg:grid-cols-4'>
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className='h-64 rounded-xl' />
        ))}
      </Grid>
    </Flex>
  );
}
