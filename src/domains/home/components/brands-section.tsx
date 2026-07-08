import { getTranslations } from 'next-intl/server';

import { SectionCarousel } from '@/components/section-carousel';
import { BrandCard } from '@/domains/home/components/ui/brand-card';
import { HomeBrandsMarquee } from '@/domains/home/components/ui/home-brands-marquee';
import { safeHomeFetch } from '@/domains/home/lib/safe-home-fetch';
import { getHomeTopBrands } from '@/services/-home-top-brands-get';

const BRAND_LIMIT = 12;

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
      <section className='py-8 sm:py-10 lg:py-12' aria-label={tCommon('partnerBrandsAria')}>
        <div className='app-container'>
          <div className='luxury-glass overflow-hidden rounded-[1.75rem] border border-white/8 py-5 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.65)] sm:rounded-[2rem] sm:py-6'>
            <HomeBrandsMarquee brands={brands} />
          </div>
        </div>
      </section>

      <SectionCarousel
        sectionId='brands'
        eyebrow={t('eyebrow')}
        title={t('title')}
        description={t('description')}
        viewAllHref='/brands'
        viewAllLabel={tCommon('viewAll')}
        loop={false}
      >
        {brands.map((brand, index) => (
          <BrandCard key={brand.id ?? index} brand={brand} />
        ))}
      </SectionCarousel>
    </>
  );
}
