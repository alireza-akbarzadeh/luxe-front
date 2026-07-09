'use client';

import { useGetAdminPromotionsKpis } from '@/services/-admin-promotions-kpis-get';

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

export function PromotionKpiCards() {
  const { data, isLoading } = useGetAdminPromotionsKpis();
  const kpis = data?.data;
  const dash = isLoading ? '—' : undefined;

  return (
    <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
      <KpiCard
        title='Active flash sales'
        value={dash ?? String(kpis?.active_flash_deals ?? 0)}
        subtitle='Live on homepage countdown'
      />
      <KpiCard
        title='Published banners'
        value={dash ?? String(kpis?.published_banners ?? 0)}
        subtitle='Seasonal picks sections'
      />
      <KpiCard
        title='Active campaigns'
        value={dash ?? String(kpis?.active_campaigns ?? 0)}
        subtitle='Currently running'
      />
      <KpiCard
        title='Scheduled campaigns'
        value={dash ?? String(kpis?.scheduled_campaigns ?? 0)}
        subtitle='Waiting to start'
      />
    </div>
  );
}
