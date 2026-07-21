import { getTranslations } from 'next-intl/server';

import { SectionCarousel } from '@/components/section-carousel';
import { HOME_RAIL_SECTION_CLASS } from '@/domains/home/lib/home-density';
import { cn } from '@/lib/utils';
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
      className={cn(HOME_RAIL_SECTION_CLASS, 'bg-secondary/30')}
      eyebrow={t('categories.eyebrow')}
      title={t('categories.title')}
      description={t('categories.description')}
      viewAllHref='/shop'
      columns={{ mobile: 2, tablet: 3, desktop: 5 }}
    >
      {categories.map((category, index) => (
        <CategoryCard
          key={category.id ?? index}
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
