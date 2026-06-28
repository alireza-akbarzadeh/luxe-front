'use client';

import { motion } from 'framer-motion';

import { Skeleton } from '@/components/ui/skeleton';
import { useGetHomeCategories } from '@/services/-home-categories-get';

import { useHomeContent } from '../hooks/use-home-content';
import { getHomeCategoryImage, sectionContainerClass } from '../lib/home-utils';
import { CategoryCard } from './category-card';
import { SectionHeader } from './section-header';

const CATEGORY_LIMIT = 8;

export function CategoriesSection() {
  const { t } = useHomeContent();
  const { data, isLoading, isError } = useGetHomeCategories({ limit: CATEGORY_LIMIT });

  const categories = data?.data?.popular ?? [];

  if (!isLoading && (isError || categories.length === 0)) {
    return null;
  }

  return (
    <section id='categories' className='bg-secondary/30 py-16 sm:py-20 lg:py-28'>
      <div className={sectionContainerClass}>
        <SectionHeader
          eyebrow={t('categories.eyebrow')}
          title={t('categories.title')}
          description={t('categories.description')}
          href='/shop'
          align='left'
        />

        {isLoading ? (
          <div className='grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4'>
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className='aspect-3/4 rounded-2xl sm:rounded-3xl' />
            ))}
          </div>
        ) : (
          <>
            <div className='custom-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:hidden'>
              {categories.map((category, index) => (
                <CategoryCard
                  key={category.id ?? index}
                  name={category.name}
                  description={category.description}
                  categoryId={category.id}
                  image={getHomeCategoryImage(category, index)}
                  shopNowLabel={t('common.shopNow')}
                  categoryAlt={t('common.categoryAlt')}
                  className='min-w-[72vw] shrink-0'
                />
              ))}
            </div>

            <div className='hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-4 lg:gap-5'>
              {categories.map((category, index) => (
                <motion.div
                  key={category.id ?? index}
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
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
