'use client';

import { useGetAdminSupportStats } from '@/services/-admin-support-stats-get';

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

export function SupportKPICards() {
  const { data, isLoading } = useGetAdminSupportStats();
  const stats = data?.data;
  const dash = isLoading ? '—' : undefined;

  const cards = [
    {
      title: 'Open tickets',
      value: dash ?? String(stats?.open_tickets ?? 0),
      subtitle: 'Open or pending',
      accent: 'bg-sky-500'
    },
    {
      title: 'Live chat',
      value: dash ?? String(stats?.chat_tickets ?? 0),
      subtitle: 'Active chat threads',
      accent: 'bg-violet-500'
    },
    {
      title: 'Email queue',
      value: dash ?? String(stats?.email_tickets ?? 0),
      subtitle: 'Email channel open',
      accent: 'bg-amber-500'
    },
    {
      title: 'Unassigned',
      value: dash ?? String(stats?.unassigned_tickets ?? 0),
      subtitle: 'Needs an owner',
      accent: 'bg-rose-500'
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
