import { getTranslations } from 'next-intl/server';

import { SectionCarousel } from '@/components/section-carousel';
import { FavoriteCategoryItem } from '@/domains/home/components/ui/favorite-category-Item';
import { safeHomeFetch } from '@/domains/home/lib/safe-home-fetch';
import { getHomeCategories } from '@/services/-home-categories-get';

const HOME_CATEGORY_LIMIT = 16;

export async function FavoriteCategoriesSection() {
  const [t, tCommon] = await Promise.all([
    getTranslations('home.favoriteCategories'),
    getTranslations('home.common')
  ]);

  const data = await safeHomeFetch(() => getHomeCategories({ limit: HOME_CATEGORY_LIMIT }));
  const categories = data?.data?.for_you ?? [];
  if (categories.length === 0) return null;

  return (
    <SectionCarousel
      sectionId='favorite-categories'
      className='border-border/40 min-h-[9.75rem] border-b py-5 sm:min-h-[10.5rem] sm:py-6'
      title={t('title')}
      hideHeader
      hideDots
      viewAllHref='/shop'
      viewAllLabel={tCommon('viewAll')}
      fitContent
      gapPx={12}
      loop={false}
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
