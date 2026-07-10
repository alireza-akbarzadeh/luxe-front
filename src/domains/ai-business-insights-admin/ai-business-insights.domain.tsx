'use client';

import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Typography } from '@/components/ui/typography';
import { InsightCard } from '@/domains/dashboard/components/insight-card';
import {
  dashboardPeriodLabel,
  dashboardPeriods,
  useDashboardPeriod
} from '@/domains/dashboard/hooks/use-dashboard-period';
import { useGetAdminAiBusinessInsights } from '@/services/-admin-ai-business-insights-get';
import type { DtoAdminBusinessInsight } from '@/services/-admin-ai-business-insights-get.schemas';

const CATEGORY_LABELS: Record<string, string> = {
  revenue: 'Revenue trends',
  products: 'Product opportunities',
  churn: 'Churn risks',
  inventory: 'Inventory & fulfillment'
};

function toInsightCard(insight: DtoAdminBusinessInsight) {
  return {
    id: insight.id,
    severity: insight.severity,
    title: insight.title,
    body: insight.body,
    action_label: insight.action_label,
    action_href: insight.action_href
  };
}

export function AiBusinessInsightsDomain() {
  const [period, setPeriod] = useDashboardPeriod();
  const { data, isLoading, error } = useGetAdminAiBusinessInsights(
    { period },
    { query: { staleTime: 60_000 } }
  );

  const report = data?.data;
  const grouped = (report?.insights ?? []).reduce<Record<string, DtoAdminBusinessInsight[]>>(
    (acc, insight) => {
      const key = insight.category ?? 'other';
      acc[key] = [...(acc[key] ?? []), insight];
      return acc;
    },
    {}
  );

  if (isLoading) {
    return <Typography.Muted>Loading business insights…</Typography.Muted>;
  }

  if (error || data?.success === false) {
    return (
      <Typography.Muted>
        {data?.message ?? 'Unable to load business insights. Restart the API and try again.'}
      </Typography.Muted>
    );
  }

  return (
    <Flex direction='column' className='gap-6'>
      <Flex direction='column' className='gap-4 lg:flex-row lg:items-end lg:justify-between'>
        <Flex direction='column' spacing={1}>
          <Badge variant='secondary' className='w-fit'>
            AI · Reports
          </Badge>
          <Typography.H2>AI business insights</Typography.H2>
          <Typography.Muted className='max-w-2xl'>
            Automated signals for revenue, products, churn, and inventory — with suggested next actions.
          </Typography.Muted>
        </Flex>

        <Tabs
          value={period}
          onValueChange={(value) => setPeriod(value as (typeof dashboardPeriods)[number])}
        >
          <TabsList>
            {dashboardPeriods.map((option) => (
              <TabsTrigger key={option} value={option}>
                {option}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </Flex>

      <div className='grid gap-4 md:grid-cols-3'>
        <Card>
          <CardHeader className='pb-2'>
            <CardDescription>Revenue trend</CardDescription>
            <CardTitle className='capitalize'>{report?.revenue_trend ?? 'stable'}</CardTitle>
          </CardHeader>
          <CardContent>
            <Typography.Muted className='text-xs'>{dashboardPeriodLabel(period)}</Typography.Muted>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardDescription>Open risks</CardDescription>
            <CardTitle>{report?.risk_count ?? 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <Typography.Muted className='text-xs'>Warnings and critical items</Typography.Muted>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardDescription>Opportunities</CardDescription>
            <CardTitle>{report?.opportunity_count ?? 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <Typography.Muted className='text-xs'>Growth and merchandising signals</Typography.Muted>
          </CardContent>
        </Card>
      </div>

      {Object.entries(grouped).map(([category, items]) => (
        <Card key={category} className='border-0 shadow-none'>
          <CardHeader>
            <CardTitle>{CATEGORY_LABELS[category] ?? category}</CardTitle>
            <CardDescription>{items.length} insight{items.length === 1 ? '' : 's'}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid gap-3 md:grid-cols-2'>
              {items.map((insight) => (
                <InsightCard
                  key={insight.id}
                  insight={toInsightCard(insight)}
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
          </CardContent>
        </Card>
      ))}
    </Flex>
  );
}
