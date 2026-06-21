'use client';

import { useHomeContent } from '../hooks/use-home-content';
import { BRAND_NAMES } from '../lib/home-mock-data';
import { fullBleedClass, sectionContainerClass } from '../lib/home-utils';

export function BrandsMarquee() {
  const { t } = useHomeContent();
  const items = [...BRAND_NAMES, ...BRAND_NAMES];

  return (
    <section
      className={`${fullBleedClass} border-border/50 bg-muted/30 border-y py-10 sm:py-12`}
      aria-label={t('common.partnerBrandsAria')}
    >
      <div className={sectionContainerClass}>
        <p className='text-muted-foreground mb-8 text-center text-xs font-medium tracking-[0.22em] uppercase'>
          {t('brands.title')}
        </p>
        <div className='relative overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]'>
          <div className='animate-marquee flex w-max gap-12 sm:gap-16'>
            {items.map((brand, index) => (
              <span
                key={`${brand}-${index}`}
                className='text-muted-foreground/80 font-display shrink-0 text-lg font-medium tracking-wide whitespace-nowrap sm:text-xl'
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
