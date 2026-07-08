import { IconHeadphones, IconLock, IconRefresh, IconTruck } from '@tabler/icons-react';
import { getTranslations } from 'next-intl/server';

import { TRUST_ITEMS } from '@/domains/home/lib/home-mock-data';
import { getHomeMarketingCopyParams } from '~/src/lib/i18n/marketing-copy-params';

import { fullBleedClass, sectionContainerClass } from '../lib/home-utils';

const iconMap = {
  truck: IconTruck,
  return: IconRefresh,
  lock: IconLock,
  headphones: IconHeadphones
} as const;

export async function TrustBar() {
  const t = await getTranslations('home');
  const copy = getHomeMarketingCopyParams();
  const trustItemParams = {
    freeShipping: { amount: copy.trust.amount },
    easyReturns: { days: copy.trust.days },
    secureCheckout: { bits: copy.trust.bits },
    support: { hours: copy.trust.hours, days: copy.trust.daysSupport }
  } as const;

  const trustItems = TRUST_ITEMS.map((item) => ({
    icon: item.icon,
    title: t(`trust.items.${item.key}.title`, trustItemParams[item.key]),
    description: t(`trust.items.${item.key}.description`, trustItemParams[item.key])
  }));
  return (
    <section className={fullBleedClass}>
      <div className={sectionContainerClass}>
        <ul className='grid grid-cols-2 gap-3 py-6 sm:grid-cols-4 sm:gap-4 sm:py-8'>
          {trustItems.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <li
                key={item.title}
                className='border-border/60 bg-card/60 hover:border-gold/40 flex items-center gap-3 rounded-xl border px-4 py-4 transition-colors sm:px-5'
              >
                <div className='bg-gold/10 border-gold/20 text-gold flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border sm:h-11 sm:w-11'>
                  <Icon className='h-5 w-5' stroke={1.5} />
                </div>
                <div className='min-w-0'>
                  <p className='truncate text-sm font-semibold'>{item.title}</p>
                  <p className='text-muted-foreground truncate text-xs sm:text-sm'>
                    {item.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
