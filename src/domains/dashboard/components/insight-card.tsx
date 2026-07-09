import type { ReactNode } from 'react';

import { Text } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import type { DtoAdminDashboardInsight } from '@/services/-admin-dashboard-overview-get.schemas';

interface InsightCardProps {
  insight: DtoAdminDashboardInsight;
  action?: ReactNode;
}

const SEVERITY_STYLES: Record<string, string> = {
  success: 'border-emerald-500/20 bg-emerald-500/5',
  warning: 'border-amber-500/20 bg-amber-500/5',
  info: 'border-sky-500/20 bg-sky-500/5',
  critical: 'border-rose-500/20 bg-rose-500/5'
};

export function InsightCard({ insight, action }: InsightCardProps) {
  const severity = insight.severity ?? 'info';

  return (
    <div
      className={cn('rounded-xl border p-4', SEVERITY_STYLES[severity] ?? SEVERITY_STYLES['info'])}
    >
      <Text variant='small' className='font-semibold'>
        {insight.title}
      </Text>
      <Text variant='muted' className='mt-1 text-xs leading-relaxed'>
        {insight.body}
      </Text>
      {action ? <div className='mt-3'>{action}</div> : null}
    </div>
  );
}
