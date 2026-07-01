import { getTranslations } from 'next-intl/server';

import { SectionCarousel } from '@/components/section-carousel';
import { BrandCard } from '@/domains/home/components/ui/brand-card';
import { getHomeTopBrands } from '@/services/-home-top-brands-get';

const BRAND_LIMIT = 12;

export async function BrandsSection() {
  const t = await getTranslations('home.brands');

  const data = await getHomeTopBrands({ limit: BRAND_LIMIT });

  const brands = data?.data?.brands ?? [];

  if (brands.length === 0) {
    return null;
  }

  return (
    <SectionCarousel
      sectionId='brands'
      eyebrow={t('featured.eyebrow')}
      title={t('brands.title')}
      description={t('featured.description')}
      viewAllHref='/shop'
      viewAllLabel={t('common.shopAll')}
      loop={false}
    >
      {brands.map((brand, index) => (
        <BrandCard key={brand.id ?? index} brand={brand} />
      ))}
    </SectionCarousel>
  );
}
