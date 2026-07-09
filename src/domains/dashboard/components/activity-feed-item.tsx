import Link from 'next/link';

import { Flex } from '@/components/ui/flex';
import { Text } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import type { DtoAdminDashboardActivity } from '@/services/-admin-dashboard-overview-get.schemas';

interface ActivityFeedItemProps {
  item: DtoAdminDashboardActivity;
  timeLabel: string;
}

export function ActivityFeedItem({ item, timeLabel }: ActivityFeedItemProps) {
  const content = (
    <Flex direction='row' align='start' justify='between' className='gap-3 rounded-xl border p-3'>
      <div className='min-w-0'>
        <Text variant='small' className='font-semibold'>
          {item.title}
        </Text>
        <Text variant='muted' className='mt-0.5 line-clamp-2 text-xs'>
          {item.description}
        </Text>
        {item.actor ? (
          <Text variant='muted' className='mt-1 text-[10px]'>
            {item.actor}
          </Text>
        ) : null}
      </div>
      <Text variant='muted' className='shrink-0 text-[10px]'>
        {timeLabel}
      </Text>
    </Flex>
  );

  if (item.href) {
    return (
      <Link href={item.href} className={cn('block transition-opacity hover:opacity-90')}>
        {content}
      </Link>
    );
  }

  return content;
}
