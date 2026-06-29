'use client';

import { IconHeadphones, IconLock, IconRefresh, IconTruck } from '@tabler/icons-react';

import { useHomeContent } from '../hooks/use-home-content';
import { fullBleedClass, sectionContainerClass } from '../lib/home-utils';

const iconMap = {
  truck: IconTruck,
  return: IconRefresh,
  lock: IconLock,
  headphones: IconHeadphones
} as const;

export function TrustBar() {
  const { trustItems } = useHomeContent();

  return (
    <section className={`${fullBleedClass} border-border/60 bg-secondary/40 border-y`}>
      <div className={sectionContainerClass}>
        <ul className='grid grid-cols-2 gap-4 py-6 sm:grid-cols-4 sm:gap-6 sm:py-8'>
          {trustItems.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <li
                key={item.title}
                className='flex items-center gap-3 sm:flex-col sm:items-center sm:text-center lg:flex-row lg:items-center lg:text-start'
              >
                <div className='bg-background text-accent border-border/60 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border shadow-sm sm:h-11 sm:w-11'>
                  <Icon className='h-5 w-5' stroke={1.5} />
                </div>
                <div className='min-w-0'>
                  <p className='text-sm font-semibold'>{item.title}</p>
                  <p className='text-muted-foreground text-xs sm:text-sm'>{item.description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
