import { IconHeadphones, IconLock, IconRefresh, IconTruck } from '@tabler/icons-react';
import { getTranslations } from 'next-intl/server';

import { TRUST_ITEMS } from '@/domains/home/lib/home-mock-data';
import { getHomeMarketingCopyParams } from '@/lib/i18n/marketing-copy-params';

import { sectionContainerClass } from '../lib/home-utils';

const iconMap = {
  truck: IconTruck,
  return: IconRefresh,
  lock: IconLock,
  headphones: IconHeadphones
} as const;

/** Slim trust strip under the hero — icon + title row like dense storefront homes. */
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
    <section className='border-border/40 border-y'>
      <div className={sectionContainerClass}>
        <ul className='grid grid-cols-2 gap-x-3 gap-y-3 py-4 sm:grid-cols-4 sm:gap-4 sm:py-5'>
          {trustItems.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <li key={item.title} className='flex min-w-0 items-center gap-2.5'>
                <div className='bg-gold/10 text-gold flex size-8 shrink-0 items-center justify-center rounded-lg'>
                  <Icon className='size-4' stroke={1.5} />
                </div>
                <div className='min-w-0'>
                  <p className='truncate text-xs font-semibold sm:text-sm'>{item.title}</p>
                  <p className='text-muted-foreground hidden truncate text-[11px] sm:block'>
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
