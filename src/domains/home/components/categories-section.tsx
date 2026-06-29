'use client';

import { motion } from 'framer-motion';

import { SectionCarousel } from '@/components/section-carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetHomeCategories } from '@/services/-home-categories-get';

import { useHomeContent } from '../hooks/use-home-content';
import { getHomeCategoryImage } from '../lib/home-utils';
import { CategoryCard } from './category-card';

const CATEGORY_LIMIT = 8;

export function CategoriesSection() {
  const { t } = useHomeContent();
  const { data, isLoading, isError } = useGetHomeCategories({ limit: CATEGORY_LIMIT });

  const categories = data?.data?.popular ?? [];

  if (!isLoading && (isError || categories.length === 0)) return null;

  return (
    <SectionCarousel
      sectionId='categories'
      className='bg-secondary/30'
      eyebrow={t('categories.eyebrow')}
      title={t('categories.title')}
      description={t('categories.description')}
      viewAllHref='/shop'
      items={categories}
      isLoading={isLoading}
      columns={{ mobile: 1, tablet: 2, desktop: 4 }}
      renderItem={(category, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, delay: index * 0.06 }}
        >
          <CategoryCard
            name={category.name}
            description={category.description}
            categoryId={category.id}
            image={getHomeCategoryImage(category, index)}
            shopNowLabel={t('common.shopNow')}
            categoryAlt={t('common.categoryAlt')}
          />
        </motion.div>
      )}
      renderSkeleton={() => <Skeleton className='aspect-3/4 w-full rounded-2xl sm:rounded-3xl' />}
    />
  );
}
