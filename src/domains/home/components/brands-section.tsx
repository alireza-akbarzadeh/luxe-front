import { getTranslations } from 'next-intl/server';

import { SectionCarousel } from '@/components/section-carousel';
import { BrandCard } from '@/domains/home/components/ui/brand-card';
import { safeHomeFetch } from '@/domains/home/lib/safe-home-fetch';
import { getHomeTopBrands } from '@/services/-home-top-brands-get';

const BRAND_LIMIT = 12;

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
  );
}
