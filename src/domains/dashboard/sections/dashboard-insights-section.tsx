import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { DtoAdminDashboardInsight } from '@/services/-admin-dashboard-overview-get.schemas';

import { InsightCard } from '../components/insight-card';
import { useDashboardStore } from '../stores/dashboard-store';

interface DashboardInsightsSectionProps {
  insights?: DtoAdminDashboardInsight[];
}

export function DashboardInsightsSection({ insights = [] }: DashboardInsightsSectionProps) {
  const insightsExpanded = useDashboardStore((state) => state.insightsExpanded);
  const toggleInsightsExpanded = useDashboardStore((state) => state.toggleInsightsExpanded);
  const visibleInsights = insightsExpanded ? insights : insights.slice(0, 2);

  return (
    <Card className='dashboard-card border-0 shadow-none'>
      <CardHeader>
        <div className='flex items-center justify-between gap-3'>
          <div>
            <CardTitle>AI insights</CardTitle>
            <CardDescription>Automated signals based on your store performance</CardDescription>
          </div>
          {insights.length > 2 ? (
            <Button variant='ghost' size='sm' className='text-xs' onClick={toggleInsightsExpanded}>
              {insightsExpanded ? 'Show less' : `Show all (${insights.length})`}
            </Button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>
        {visibleInsights.length === 0 ? (
          <p className='text-muted-foreground py-6 text-center text-sm'>No insights yet.</p>
        ) : (
          <div className='grid gap-3 md:grid-cols-2'>
            {visibleInsights.map((insight) => (
              <InsightCard
                key={insight.id}
                insight={insight}
                action={
                  insight.action_href && insight.action_label ? (
                    <Link
                      href={insight.action_href}
                      className='text-primary text-xs font-semibold hover:underline'
                    >
                      {insight.action_label}
                    </Link>
                  ) : null
                }
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
