'use client';

import { useGetAdminCustomersStats } from '@/services/-admin-customers-stats-get';

function KPICard({
  title,
  value,
  subtitle,
  accent
}: {
  title: string;
  value: string;
  subtitle: string;
  accent: string;
}) {
  return (
    <div className='bg-card relative overflow-hidden rounded-2xl border p-5 shadow-sm'>
      <div className={`absolute -top-4 -right-4 h-20 w-20 rounded-full opacity-10 ${accent}`} />
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

export function CustomersKPICards() {
  const { data, isLoading } = useGetAdminCustomersStats();
  const stats = data?.data;

  const cards = [
    {
      title: 'Total customers',
      value: isLoading ? '—' : String(stats?.total_customers ?? 0),
      subtitle: 'Registered shoppers',
      accent: 'bg-primary'
    },
    {
      title: 'Luxe Plus',
      value: isLoading ? '—' : String(stats?.plus_members ?? 0),
      subtitle: 'Active members',
      accent: 'bg-violet-500'
    },
    {
      title: 'New this month',
      value: isLoading ? '—' : String(stats?.new_this_month ?? 0),
      subtitle: 'Joined in last 30 days',
      accent: 'bg-sky-500'
    },
    {
      title: 'VIP segment',
      value: isLoading ? '—' : String(stats?.vip_customers ?? 0),
      subtitle: 'Tagged VIP customers',
      accent: 'bg-amber-500'
    }
  ];

  return (
    <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
      {cards.map((card) => (
        <KPICard key={card.title} {...card} />
      ))}
    </div>
  );
}
