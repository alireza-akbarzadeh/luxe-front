'use client';

import Image from 'next/image';

import { SectionCarousel } from '@/components/section-carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetHomeTopBrands } from '@/services/-home-top-brands-get';
import type { DtoHomeBrandItem } from '@/services/-home-top-brands-get.schemas';
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
      columns={{ mobile: 1, tablet: 2, desktop: 4 }}
      opts={{ align: 'start', loop: false, skipSnaps: false }}
      renderItem={(brand, index) => <BrandCard key={brand.id ?? index} brand={brand} />}
      renderSkeleton={() => <Skeleton className='aspect-4/5 w-full rounded-2xl' />}
    />
  );
}

function BrandCard({ brand }: { brand: DtoHomeBrandItem }) {
  return (
    <div>
      {/* using this dto create a brands card */}
      <div className='relative h-12 w-12 overflow-hidden rounded-md p-2'>
        {brand.logo_url ? (
          <Image src={brand.logo_url} alt={brand.name ?? ''} width={100} height={100} />
        ) : (
          <div className='text-muted-foreground flex h-full w-full items-center justify-center text-xs'>
            —
          </div>
        )}
        <div className='from-foreground/90 via-foreground/40 absolute inset-0 bg-gradient-to-t to-transparent' />
        <div className='from-foreground/90 via-foreground/40 absolute inset-0 bg-gradient-to-b to-transparent' />
        <div className='from-foreground/90 via-foreground/40 absolute inset-0 bg-gradient-to-l to-transparent' />
        <div className='from-foreground/90 via-foreground/40 absolute inset-0 bg-gradient-to-r to-transparent' />
        <div className='from-foreground/90 via-foreground/40 absolute inset-0 bg-gradient-to-tl to-transparent' />
        <div className='from-foreground/90 via-foreground/40 absolute inset-0 bg-gradient-to-tr to-transparent' />
        <div className='from-foreground/90 via-foreground/40 absolute inset-0 bg-gradient-to-bl to-transparent' />
        <div className='from-foreground/90 via-foreground/40 absolute inset-0 bg-gradient-to-br to-transparent' />
      </div>
      <div className='flex flex-col'>
        <span className='font-medium'>{brand.name ?? ''}</span>
        <span className='text-muted-foreground text-xs'>{brand.slug ?? ''}</span>
      </div>
      <div className='text-muted-foreground line-clamp-2 max-w-[280px] text-sm'>
        {brand.description ?? ''}
      </div>
      <div className='text-muted-foreground text-xs'>{brand.product_count ?? ''} products</div>
      <div className='text-muted-foreground text-xs'>{brand.rating ?? ''} rating</div>
      <div className='text-muted-foreground text-xs'>{brand.revenue ?? ''} revenue</div>
      <div className='text-muted-foreground text-xs'>{brand.units_sold ?? ''} units sold</div>
      <div className='text-muted-foreground text-xs'>{brand.updated_at ?? ''} updated at</div>
      <div
        className='text-muted-foreground text-xs'
        style={{
          color: brand.workflow_state?.text_color ?? 'inherit',
          backgroundColor: brand.workflow_state?.color ?? 'inherit'
        }}
      >
        {brand.workflow_state?.name ?? ''} workflow state
      </div>
    </div>
  );
}
