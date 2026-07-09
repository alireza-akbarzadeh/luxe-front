'use client';

import { useGetAdminEmailMarketingKpis } from '@/services/-admin-email-marketing-kpis-get';

function KpiCard({ title, value, subtitle }: { title: string; value: string; subtitle: string }) {
  return (
    <div className='bg-card relative overflow-hidden rounded-2xl border p-5 shadow-sm'>
      <p className='text-muted-foreground text-[10px] font-bold tracking-widest uppercase'>
        {title}
      </p>
      <p className='text-foreground mt-2 text-3xl font-black tracking-tight tabular-nums'>
        {value}
      </p>
      <p className='text-muted-foreground mt-1 text-[10px]'>{subtitle}</p>
    </div>
  );
}

export function EmailMarketingKpiCards() {
  const { data, isLoading } = useGetAdminEmailMarketingKpis();
  const kpis = data?.data;
  const dash = isLoading ? '—' : undefined;

  return (
    <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
      <KpiCard
        title='Active subscribers'
        value={dash ?? String(kpis?.active_subscribers ?? 0)}
        subtitle={`${kpis?.total_subscribers ?? 0} total · ${kpis?.unsubscribed_count ?? 0} unsubscribed`}
      />
      <KpiCard
        title='Templates'
        value={dash ?? String(kpis?.template_count ?? 0)}
        subtitle='Reusable HTML layouts'
      />
      <KpiCard
        title='Campaigns sent'
        value={dash ?? String(kpis?.campaigns_sent ?? 0)}
        subtitle={`${kpis?.campaigns_scheduled ?? 0} scheduled`}
      />
      <KpiCard
        title='Emails delivered'
        value={dash ?? String(kpis?.total_emails_delivered ?? 0)}
        subtitle='Queued via job pipeline'
      />
    </div>
  );
}
