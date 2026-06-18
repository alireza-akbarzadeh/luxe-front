import { IconActivity, IconClock, IconHistory, IconUsers } from '@tabler/icons-react';

import { cn } from '@/lib/utils';
import type { DtoAuditLogSummaryResponse } from '@/services/-admin-audit-logs-summary-get.schemas';

interface AuditKpiCardsProps {
  summary?: DtoAuditLogSummaryResponse;
  isLoading?: boolean;
}

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  isLoading?: boolean;
}

function KPICard({ title, value, subtitle, icon: Icon, accent, isLoading }: KPICardProps) {
  return (
    <div className='group bg-card relative overflow-hidden rounded-2xl border p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md'>
      <div
        className={cn(
          'absolute -top-4 -right-4 h-24 w-24 rounded-full opacity-10 transition-opacity group-hover:opacity-20',
          accent
        )}
      />
      <div className='relative flex items-start justify-between'>
        <div>
          <p className='text-muted-foreground text-[10px] font-bold tracking-widest uppercase'>
            {title}
          </p>
          <p className='text-foreground mt-2 text-3xl font-black tracking-tight'>
            {isLoading ? '—' : value}
          </p>
          <p className='text-muted-foreground mt-1.5 text-[10px]'>{subtitle}</p>
        </div>
        <div className={cn('flex h-12 w-12 items-center justify-center rounded-2xl', accent, 'bg-opacity-15')}>
          <Icon className={cn('h-5 w-5', accent.replace('bg-', 'text-'))} />
        </div>
      </div>
    </div>
  );
}

export function AuditKpiCards({ summary, isLoading }: AuditKpiCardsProps) {
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
      <KPICard
        title='Total events'
        value={(summary?.total ?? 0).toLocaleString()}
        subtitle='All recorded admin mutations'
        icon={IconHistory}
        accent='bg-violet-500'
        isLoading={isLoading}
      />
      <KPICard
        title='Last 24 hours'
        value={(summary?.last_24_hours ?? 0).toLocaleString()}
        subtitle='Recent activity window'
        icon={IconActivity}
        accent='bg-blue-500'
        isLoading={isLoading}
      />
      <KPICard
        title='Today'
        value={(summary?.today ?? 0).toLocaleString()}
        subtitle='Events since midnight UTC'
        icon={IconClock}
        accent='bg-emerald-500'
        isLoading={isLoading}
      />
      <KPICard
        title='Unique actors'
        value={(summary?.unique_actors ?? 0).toLocaleString()}
        subtitle='Staff who triggered audit events'
        icon={IconUsers}
        accent='bg-amber-500'
        isLoading={isLoading}
      />
    </div>
  );
}
