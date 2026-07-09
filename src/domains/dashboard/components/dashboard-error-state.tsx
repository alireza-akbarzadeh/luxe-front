import { IconRefresh } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Text } from '@/components/ui/typography';

interface DashboardErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export function DashboardErrorState({ message, onRetry }: DashboardErrorStateProps) {
  return (
    <Flex
      direction='column'
      align='center'
      justify='center'
      className='dashboard-card min-h-[420px] gap-4 border-dashed text-center'
    >
      <div>
        <Text variant='h3'>Unable to load dashboard</Text>
        <Text variant='muted' className='mt-1 max-w-md text-sm'>
          {message ??
            'The dashboard overview endpoint is unavailable. Restart the API after pulling the latest backend changes, then try again.'}
        </Text>
      </div>
      <Button variant='outline' onClick={onRetry}>
        <IconRefresh className='mr-2 h-4 w-4' />
        Retry
      </Button>
    </Flex>
  );
}
