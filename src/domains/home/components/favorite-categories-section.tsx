import { getTranslations } from 'next-intl/server';

import { SectionCarousel } from '@/components/section-carousel';
import { FavoriteCategoryItem } from '@/domains/home/components/ui/favorite-category-Item';
import { getHomeCategories } from '@/services/-home-categories-get';

const HOME_CATEGORY_LIMIT = 8;

export async function FavoriteCategoriesSection() {
  const [t, tCommon] = await Promise.all([
    getTranslations('home.favoriteCategories'),
    getTranslations('home.common')
  ]);

  const data = await getHomeCategories({ limit: HOME_CATEGORY_LIMIT });
  const categories = data?.data?.for_you ?? [];
  if (categories.length === 0) return null;

  return (
    <SectionCarousel
      sectionId='favorite-categories'
      className='border-border/40 border-b py-10 sm:py-12 lg:py-16'
      eyebrow={t('eyebrow')}
      title={t('title')}
      description={t('description')}
      viewAllHref='/shop'
      viewAllLabel={tCommon('viewAll')}
      columns={{ mobile: 2, tablet: 3, desktop: 4 }}
    >
      {categories.map((category, index) => (
        <FavoriteCategoryItem
          key={category.id}
          category={category}
          index={index}
          shopNowLabel={tCommon('shopNow')}
          categoryAlt={tCommon('categoryAlt')}
        />
      ))}
    </SectionCarousel>
  );
}
