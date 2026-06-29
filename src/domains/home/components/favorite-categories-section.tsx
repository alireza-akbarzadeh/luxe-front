'use client';

import { useTranslations } from 'next-intl';

import { SectionCarousel } from '@/components/section-carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetHomeCategories } from '@/services/-home-categories-get';
import { FavoriteCategoryItem } from '~/src/domains/home/components/ui/favorite-category-Item';

const HOME_CATEGORY_LIMIT = 8;

export function FavoriteCategoriesSection() {
  const t = useTranslations('home.favoriteCategories');
  const tCommon = useTranslations('home.common');

  const { data, isLoading, isError } = useGetHomeCategories({
    limit: HOME_CATEGORY_LIMIT
  });

  const categories = data?.data?.for_you ?? [];

  if (!isLoading && (isError || categories.length === 0)) {
    return null;
  }

  return (
    <SectionCarousel
      sectionId='favorite-categories'
      className='border-border/40 border-b py-10 sm:py-12 lg:py-16'
      eyebrow={t('eyebrow')}
      title={t('title')}
      description={t('description')}
      viewAllHref='/shop'
      viewAllLabel={tCommon('viewAll')}
      items={categories}
      isLoading={isLoading}
      columns={{ mobile: 2, tablet: 3, desktop: 4 }}
      skeletonCount={HOME_CATEGORY_LIMIT}
      renderSkeleton={() => <Skeleton className='aspect-[0.78] w-full rounded-3xl' />}
      renderItem={(category, index) => (
        <FavoriteCategoryItem
          category={category}
          index={index}
          shopNowLabel={tCommon('shopNow')}
          categoryAlt={tCommon('categoryAlt')}
        />
      )}
    />
  );
}
