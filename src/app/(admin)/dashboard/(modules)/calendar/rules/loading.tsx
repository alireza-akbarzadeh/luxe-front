import { Grid } from '@/components/ui/grid';
import { Skeleton } from '@/components/ui/skeleton';

export default function CalendarRulesLoading() {
  return (
    <Grid cols={1} gap={4} className='sm:grid-cols-2 lg:grid-cols-3'>
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className='h-32 w-full rounded-xl' />
      ))}
    </Grid>
  );
}
