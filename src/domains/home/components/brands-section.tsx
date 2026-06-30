import { getTranslations } from 'next-intl/server';

import { SectionCarousel } from '@/components/section-carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { getHomeTopBrands } from '@/services/-home-top-brands-get';
import { BrandCard } from '~/src/domains/home/components/ui/brand-card';

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
      items={brands}
      isLoading={false}
      columns={{ mobile: 2, tablet: 3, desktop: 4 }}
      loop={false}
      skeletonCount={BRAND_LIMIT}
      renderItem={(brand, index) => <BrandCard key={brand.id ?? index} brand={brand} />}
      renderSkeleton={() => <Skeleton className='h-56 w-full rounded-2xl' />}
    />
  );
}
