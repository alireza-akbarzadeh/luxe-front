import { formatDistanceToNow, parseISO } from 'date-fns';
import Link from 'next/link';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Text } from '@/components/ui/typography';
import type { DtoAdminDashboardActivity } from '@/services/-admin-dashboard-overview-get.schemas';

import { ActivityFeedItem } from '../components/activity-feed-item';

interface DashboardActivitySectionProps {
  activity?: DtoAdminDashboardActivity[];
}

export function DashboardActivitySection({ activity = [] }: DashboardActivitySectionProps) {
  return (
    <Card className='dashboard-card border-0 shadow-none'>
      <CardHeader>
        <Flex direction='row' align='center' justify='between' className='gap-4'>
          <div>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Orders and admin actions across the platform</CardDescription>
          </div>
          <Link href='/dashboard/audit-logs' className='text-xs font-semibold hover:underline'>
            Audit logs
          </Link>
        </Flex>
      </CardHeader>
      <CardContent>
        {activity.length === 0 ? (
          <Text variant='muted' className='py-8 text-center text-sm'>
            No recent activity for this period.
          </Text>
        ) : (
          <div className='space-y-2'>
            {activity.map((item) => (
              <ActivityFeedItem
                key={item.id}
                item={item}
                timeLabel={
                  item.created_at
                    ? formatDistanceToNow(parseISO(item.created_at), { addSuffix: true })
                    : '—'
                }
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
