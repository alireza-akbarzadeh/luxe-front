import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Text } from '@/components/ui/typography';
import type { DtoAdminDashboardHealth } from '@/services/-admin-dashboard-overview-get.schemas';

import { HealthStatusBadge } from '../components/health-status-badge';

interface DashboardHealthSectionProps {
  health?: DtoAdminDashboardHealth;
}

export function DashboardHealthSection({ health }: DashboardHealthSectionProps) {
  if (!health) return null;

  return (
    <Card className='dashboard-card border-0 shadow-none'>
      <CardHeader className='pb-3'>
        <Flex direction='row' align='center' justify='between' className='gap-3'>
          <div>
            <CardTitle>Platform health</CardTitle>
            <CardDescription>{health.message ?? 'Operational status overview'}</CardDescription>
          </div>
          <HealthStatusBadge status={health.status} />
        </Flex>
      </CardHeader>
      <CardContent>
        <div className='grid gap-3 sm:grid-cols-3'>
          <div className='rounded-xl border p-3'>
            <Text variant='muted' className='text-[10px] tracking-widest uppercase'>
              API latency
            </Text>
            <Text variant='h4' className='mt-1 tabular-nums'>
              {health.api_latency_ms ?? 0} ms
            </Text>
          </div>
          <div className='rounded-xl border p-3'>
            <Text variant='muted' className='text-[10px] tracking-widest uppercase'>
              Error rate (24h)
            </Text>
            <Text variant='h4' className='mt-1 tabular-nums'>
              {(health.error_rate ?? 0).toFixed(1)}%
            </Text>
          </div>
          <div className='rounded-xl border p-3'>
            <Text variant='muted' className='text-[10px] tracking-widest uppercase'>
              Queue depth
            </Text>
            <Text variant='h4' className='mt-1 tabular-nums'>
              {(health.queue_depth ?? 0).toLocaleString()}
            </Text>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
