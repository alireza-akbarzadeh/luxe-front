'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { toSuspenseOptions } from '@/lib/use-suspense-query';
import { getGetHomeTopBrandsQueryOptions } from '@/services/-home-top-brands-get';

import { useHomeContent } from '../hooks/use-home-content';
import { fullBleedClass, sectionContainerClass } from '../lib/home-utils';

const BRAND_LIMIT = 12;

export function BrandsMarquee() {
  const { t } = useHomeContent();

  const { data, isError } = useSuspenseQuery(
    toSuspenseOptions(getGetHomeTopBrandsQueryOptions({ limit: BRAND_LIMIT }))
  );

  const brands = data?.data?.brands ?? [];

  if (isError || brands.length === 0) {
    return null;
  }

  const items = [...brands, ...brands];

  return (
    <section
      className={`${fullBleedClass} border-border/50 bg-muted/30 border-y py-10 sm:py-12`}
      aria-label={t('common.partnerBrandsAria')}
      aria-busy={false}
    >
      <div className={sectionContainerClass}>
        <p className='text-muted-foreground mb-8 text-center text-xs font-medium tracking-[0.22em] uppercase'>
          {t('brands.title')}
        </p>

        <div className='relative overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]'>
          <div className='animate-marquee flex w-max gap-12 sm:gap-16'>
            {items.map((brand, index) => (
              <span
                key={`${brand.id ?? brand.slug}-${index}`}
                className='text-muted-foreground/80 font-display shrink-0 text-lg font-medium tracking-wide whitespace-nowrap sm:text-xl'
              >
                {brand.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
