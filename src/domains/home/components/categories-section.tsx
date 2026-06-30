'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { SectionCarousel } from '@/components/section-carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { toSuspenseOptions } from '@/lib/use-suspense-query';
import { getGetHomeCategoriesQueryOptions } from '@/services/-home-categories-get';

import { useHomeContent } from '../hooks/use-home-content';
import { getHomeCategoryImage } from '../lib/home-utils';
import { CategoryCard } from './category-card';

const CATEGORY_LIMIT = 8;

export function CategoriesSection() {
  const { t } = useHomeContent();

  const { data, isError } = useSuspenseQuery(
    toSuspenseOptions(getGetHomeCategoriesQueryOptions({ limit: CATEGORY_LIMIT }))
  );

  const categories = data?.data?.popular ?? [];

  if (isError || categories.length === 0) {
    return null;
  }

  return (
    <SectionCarousel
      sectionId='categories'
      className='bg-secondary/30'
      eyebrow={t('categories.eyebrow')}
      title={t('categories.title')}
      description={t('categories.description')}
      viewAllHref='/shop'
      items={categories}
      isLoading={false}
      columns={{ mobile: 1, tablet: 2, desktop: 4 }}
      skeletonCount={CATEGORY_LIMIT}
      renderItem={(category, index) => (
        <CategoryCard
          name={category.name}
          description={category.description}
          categoryId={category.id}
          image={getHomeCategoryImage(category, index)}
          shopNowLabel={t('common.shopNow')}
          categoryAlt={t('common.categoryAlt')}
        />
      )}
      renderSkeleton={() => <Skeleton className='aspect-3/4 w-full rounded-2xl sm:rounded-3xl' />}
    />
  );
}
