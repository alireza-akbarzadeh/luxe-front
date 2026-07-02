import { getTranslations } from 'next-intl/server';

import { safeHomeFetch } from '@/domains/home/lib/safe-home-fetch';
import { getHomeTopBrands } from '@/services/-home-top-brands-get';

import { fullBleedClass, sectionContainerClass } from '../lib/home-utils';
import { BrandsMarqueeTrack } from './ui/brands-marquee-track';

const BRAND_LIMIT = 12;

export async function BrandsMarquee() {
  const [t, tCommon] = await Promise.all([
    getTranslations('home.brands'),
    getTranslations('home.common')
  ]);

  const data = await safeHomeFetch(() => getHomeTopBrands({ limit: BRAND_LIMIT }));

  const brands = data?.data?.brands ?? [];

  if (brands.length === 0) {
    return null;
  }

  const items = brands.map((brand, index) => ({
    key: String(brand.id ?? brand.slug ?? index),
    name: brand.name ?? ''
  }));

  return (
    <section
      className={`${fullBleedClass} border-border/50 bg-muted/30 border-y py-10 sm:py-12`}
      aria-label={tCommon('partnerBrandsAria')}
      aria-busy={false}
    >
      <div className={sectionContainerClass}>
        <p className='text-muted-foreground mb-8 text-center text-xs font-medium tracking-[0.22em] uppercase'>
          {t('title')}
        </p>

        <BrandsMarqueeTrack items={items} />
      </div>
    </section>
  );
}
