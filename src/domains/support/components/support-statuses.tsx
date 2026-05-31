'use client';
import { type TablerIcon } from '@tabler/icons-react';

import { InfoCard } from '~/src/domains/support/components/info-card';

type StatusesOptions = {
  icon: TablerIcon;
  title: string;
  description: string;
};

interface SupportStatuesProps {
  options: Readonly<StatusesOptions[]>;
}

export function SupportStatuses(props: SupportStatuesProps) {
  const { options } = props;

  return (
    <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
      {options.map((s, i) => (
        <InfoCard
          key={s.title}
          icon={s.icon}
          title={s.title}
          description={s.description}
          index={i}
        />
      ))}
    </div>
  );
}
