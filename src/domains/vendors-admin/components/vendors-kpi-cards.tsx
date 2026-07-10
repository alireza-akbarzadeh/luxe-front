'use client';

import { useGetAdminVendorsKpis } from '@/services/-admin-vendors-kpis-get';

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

export function VendorsKpiCards() {
  const { data, isLoading } = useGetAdminVendorsKpis();
  const kpis = data?.data;
  const dash = isLoading ? '—' : undefined;

  return (
    <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-5'>
      <KpiCard
        title='Total vendors'
        value={dash ?? String(kpis?.total_stores ?? 0)}
        subtitle='All storefronts'
      />
      <KpiCard
        title='Pending approval'
        value={dash ?? String(kpis?.pending_count ?? 0)}
        subtitle='Awaiting review'
      />
      <KpiCard
        title='Active'
        value={dash ?? String(kpis?.active_count ?? 0)}
        subtitle='Live on marketplace'
      />
      <KpiCard
        title='Suspended'
        value={dash ?? String(kpis?.suspended_count ?? 0)}
        subtitle='Blocked or rejected'
      />
      <KpiCard
        title='Verified'
        value={dash ?? String(kpis?.verified_count ?? 0)}
        subtitle='Trust badge issued'
      />
    </div>
  );
}
