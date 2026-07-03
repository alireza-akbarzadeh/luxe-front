import { getTranslations } from 'next-intl/server';

import { SectionCarousel } from '@/components/section-carousel';
import { BrandCard } from '@/domains/home/components/ui/brand-card';
import { BrandsMarqueeTrack } from '@/domains/home/components/ui/brands-marquee-track';
import { fullBleedClass } from '@/domains/home/lib/home-utils';
import { safeHomeFetch } from '@/domains/home/lib/safe-home-fetch';
import { getHomeTopBrands } from '@/services/-home-top-brands-get';
import type { DtoHomeBrandItem } from '@/services/-home-top-brands-get.schemas';

const BRAND_LIMIT = 12;

function toMarqueeItems(brands: DtoHomeBrandItem[]) {
  return brands.map((brand, index) => ({
    key: String(brand.id ?? brand.slug ?? index),
    name: brand.name ?? ''
  }));
}

/** Top brands — one API fetch: trust marquee strip + brand cards carousel. */
export async function BrandsSection() {
  const [t, tCommon] = await Promise.all([
    getTranslations('home.brands'),
    getTranslations('home.common')
  ]);

  const data = await safeHomeFetch(() => getHomeTopBrands({ limit: BRAND_LIMIT }));
  const brands = data?.data?.brands ?? [];

  if (brands.length === 0) {
    return null;
  }

  return (
    <>
      <section
        className={`${fullBleedClass} border-border/50 bg-muted/30 border-y py-8 sm:py-10`}
        aria-label={tCommon('partnerBrandsAria')}
      >
        <p className='text-foreground/90 app-container mb-6 text-center text-xs font-medium tracking-[0.22em] uppercase'>
          {t('title')}
        </p>
        <BrandsMarqueeTrack items={toMarqueeItems(brands)} />
      </section>

      <SectionCarousel
        sectionId='brands'
        eyebrow={t('eyebrow')}
        title={t('title')}
        description={t('description')}
        viewAllHref='/shop'
        viewAllLabel={tCommon('shopAll')}
        loop={false}
      >
        {brands.map((brand, index) => (
          <BrandCard key={brand.id ?? index} brand={brand} />
        ))}
      </SectionCarousel>
    </>
  );
}
