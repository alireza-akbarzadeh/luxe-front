import { getTranslations } from 'next-intl/server';

import { SectionCarousel } from '@/components/section-carousel';
import { getHomeCategories } from '@/services/-home-categories-get';

import { getHomeCategoryImage } from '../lib/home-utils';
import { CategoryCard } from './category-card';

const CATEGORY_LIMIT = 8;

export async function CategoriesSection() {
  const t = await getTranslations('home');

  const data = await getHomeCategories({ limit: CATEGORY_LIMIT });

  const categories = data?.data?.popular ?? [];

  if (categories.length === 0) {
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
    >
      {categories.map((category, index) => (
        <CategoryCard
          name={category.name}
          description={category.description}
          categoryId={category.id}
          image={getHomeCategoryImage(category, index)}
          shopNowLabel={t('common.shopNow')}
          categoryAlt={t('common.categoryAlt')}
        />
      ))}
    </SectionCarousel>
  );
}
