'use client';

import { SectionCarousel } from '@/components/section-carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetHomeTopBrands } from '@/services/-home-top-brands-get';
import { BrandCard } from '~/src/domains/home/components/ui/brand-card';
import { useHomeContent } from '~/src/domains/home/hooks/use-home-content';

const BRAND_LIMIT = 12;

export function BrandsSection() {
  const { data, isLoading, isError } = useGetHomeTopBrands({ limit: BRAND_LIMIT });
  const brands = data?.data?.brands ?? [];
  const { t } = useHomeContent();

  if (!isLoading && (isError || brands.length === 0)) {
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
      isLoading={isLoading}
      columns={{ mobile: 2, tablet: 3, desktop: 4 }}
      loop={false}
      renderItem={(brand, index) => <BrandCard key={brand.id ?? index} brand={brand} />}
      renderSkeleton={() => <Skeleton className='h-56 w-full rounded-2xl' />}
    />
  );
}
