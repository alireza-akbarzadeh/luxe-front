'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetHomeCategories } from '@/services/-home-categories-get';
import type { DtoHomeCategoryItem } from '@/services/-home-categories-get.schemas';

import { getHomeCategoryImage, sectionContainerClass } from '../lib/home-utils';
import { CategoryCard } from './category-card';
import { SectionHeader } from './section-header';
import { HomeFadeIn } from './ui/home-fade-in';

const HOME_CATEGORY_LIMIT = 8;

function FavoriteCategoriesSkeleton() {
  return (
    <>
      <Flex className='custom-scrollbar -mx-4 gap-4 overflow-x-auto px-4 pb-2 lg:hidden'>
        {Array.from({ length: 6 }).map((_, index) => (
          <Flex key={index} align='center' className='w-[5.5rem] shrink-0 flex-col gap-2.5 sm:w-28'>
            <Skeleton className='size-[4.5rem] rounded-full sm:size-20' />
            <Skeleton className='h-3 w-16 rounded-full' />
          </Flex>
        ))}
      </Flex>
      <Grid className='hidden gap-5 sm:grid-cols-4 lg:grid lg:grid-cols-4'>
        {Array.from({ length: 4 }).map((_, index) => (
          <Flex key={index} align='center' className='flex-col gap-3'>
            <Skeleton className='size-20 rounded-full' />
            <Skeleton className='h-3 w-20 rounded-full' />
          </Flex>
        ))}
      </Grid>
    </>
  );
}

function FavoriteCategoryItem({
  category,
  index,
  shopNowLabel,
  categoryAlt
}: Readonly<{
  category: DtoHomeCategoryItem;
  index: number;
  shopNowLabel: string;
  categoryAlt: string;
}>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <CategoryCard
        variant='compact'
        name={category.name}
        categoryId={category.id}
        image={getHomeCategoryImage(category, index)}
        shopNowLabel={shopNowLabel}
        categoryAlt={categoryAlt}
      />
    </motion.div>
  );
}

export function FavoriteCategoriesSection() {
  const t = useTranslations('home.favoriteCategories');
  const tCommon = useTranslations('home.common');
  const { data, isLoading, isError } = useGetHomeCategories({ limit: HOME_CATEGORY_LIMIT });

  const forYou = data?.data?.for_you ?? [];

  if (!isLoading && (isError || forYou.length === 0)) {
    return null;
  }

  return (
    <HomeFadeIn>
      <section
        id='favorite-categories'
        className='border-border/40 border-b py-10 sm:py-12 lg:py-14'
        aria-busy={isLoading}
      >
        <div className={sectionContainerClass}>
          <SectionHeader
            eyebrow={t('eyebrow')}
            title={t('title')}
            description={t('description')}
            href='/shop'
            align='left'
            className='mb-8 md:mb-10'
          />

          {isLoading ? (
            <FavoriteCategoriesSkeleton />
          ) : (
            <>
              <Flex className='custom-scrollbar -mx-4 gap-4 overflow-x-auto px-4 pb-2 lg:hidden'>
                {forYou.map((category, index) => (
                  <FavoriteCategoryItem
                    key={category.id ?? index}
                    category={category}
                    index={index}
                    shopNowLabel={tCommon('shopNow')}
                    categoryAlt={tCommon('categoryAlt')}
                  />
                ))}
              </Flex>

              <Grid className='hidden gap-6 sm:grid-cols-4 lg:grid lg:grid-cols-4 lg:gap-8'>
                {forYou.map((category, index) => (
                  <FavoriteCategoryItem
                    key={category.id ?? `desktop-${index}`}
                    category={category}
                    index={index}
                    shopNowLabel={tCommon('shopNow')}
                    categoryAlt={tCommon('categoryAlt')}
                  />
                ))}
              </Grid>
            </>
          )}
        </div>
      </section>
    </HomeFadeIn>
  );
}
