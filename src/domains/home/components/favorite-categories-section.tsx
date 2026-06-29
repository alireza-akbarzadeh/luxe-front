'use client';

import { IconArrowRight } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Skeleton } from '@/components/ui/skeleton';
import { useGetHomeCategories } from '@/services/-home-categories-get';
import type { DtoHomeCategoryItem } from '@/services/-home-categories-get.schemas';

import { getHomeCategoryImage, sectionContainerClass } from '../lib/home-utils';
import { CategoryCard } from './category-card';
import { SectionHeader } from './section-header';
import { HomeFadeIn } from './ui/home-fade-in';

const HOME_CATEGORY_LIMIT = 8;

// ── Skeleton ────────────────────────────────────────────────────────────────

function FavoriteCategoriesSkeleton() {
  return (
    <>
      {/* Mobile: horizontal strip */}
      <div
        className='flex gap-4 overflow-x-auto px-4 pb-3 lg:hidden'
        style={{
          marginLeft: '-1rem',
          marginRight: '-1rem',
          paddingLeft: '1rem',
          paddingRight: '1rem'
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className='flex w-[4.5rem] shrink-0 flex-col items-center gap-2.5 sm:w-24'>
            <Skeleton className='size-[4.5rem] rounded-full sm:size-20' />
            <Skeleton className='h-2.5 w-14 rounded-full' />
          </div>
        ))}
      </div>

      {/* Desktop: 4-col grid */}
      <div className='hidden grid-cols-4 gap-6 lg:grid'>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className='flex flex-col items-center gap-3'>
            <Skeleton className='size-24 rounded-full' />
            <Skeleton className='h-3 w-20 rounded-full' />
          </div>
        ))}
      </div>
    </>
  );
}

// ── Single item ──────────────────────────────────────────────────────────────

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
      // Keep the item from shrinking — critical for horizontal scroll to work
      className='shrink-0'
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
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

// ── Section ──────────────────────────────────────────────────────────────────

export function FavoriteCategoriesSection() {
  const t = useTranslations('home.favoriteCategories');
  const tCommon = useTranslations('home.common');
  const { data, isLoading, isError } = useGetHomeCategories({ limit: HOME_CATEGORY_LIMIT });

  const forYou = data?.data?.for_you ?? [];

  if (!isLoading && (isError || forYou.length === 0)) return null;

  return (
    <HomeFadeIn>
      <section
        id='favorite-categories'
        className='border-border/40 border-b py-10 sm:py-12 lg:py-16'
        aria-busy={isLoading}
      >
        <div className={sectionContainerClass}>
          {/* Header — sits inside the container with normal padding */}
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
              {/* ── Mobile: full-bleed scrollable strip ─────────────────── */}
              {/*
                We break out of the container's horizontal padding so the
                scroll strip touches the viewport edges, then restore left
                padding so the first item aligns with the section text above.
              */}
              <div
                className='lg:hidden'
                style={{
                  marginLeft: 'calc(var(--container-px, 1rem) * -1)',
                  marginRight: 'calc(var(--container-px, 1rem) * -1)'
                }}
              >
                <div
                  className='custom-scrollbar flex gap-4 overflow-x-auto scroll-smooth pb-3'
                  style={{
                    paddingLeft: 'var(--container-px, 1rem)',
                    paddingRight: 'var(--container-px, 1rem)'
                  }}
                >
                  {forYou.map((category, index) => (
                    <FavoriteCategoryItem
                      key={category.id ?? index}
                      category={category}
                      index={index}
                      shopNowLabel={tCommon('shopNow')}
                      categoryAlt={tCommon('categoryAlt')}
                    />
                  ))}

                  {/* "View all" tile at the end of the strip */}
                  <motion.div
                    className='shrink-0'
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: forYou.length * 0.05 }}
                  >
                    <Link
                      href='/shop'
                      className='group flex h-full w-[4.5rem] flex-col items-center justify-center gap-2 sm:w-24'
                    >
                      {/* Circle button */}
                      <span className='bg-muted border-border group-hover:bg-muted/70 flex size-[4.5rem] items-center justify-center rounded-full border transition-colors sm:size-20'>
                        <IconArrowRight className='text-foreground/70 size-5' stroke={1.5} />
                      </span>
                      <span className='text-muted-foreground text-center text-[11px] leading-tight font-medium sm:text-xs'>
                        {tCommon('viewAll') ?? 'View all'}
                      </span>
                    </Link>
                  </motion.div>
                </div>
              </div>

              {/* ── Desktop: uniform grid ────────────────────────────────── */}
              <div className='hidden grid-cols-4 gap-6 lg:grid xl:gap-8'>
                {forYou.slice(0, 8).map((category, index) => (
                  <FavoriteCategoryItem
                    key={category.id ?? `desktop-${index}`}
                    category={category}
                    index={index}
                    shopNowLabel={tCommon('shopNow')}
                    categoryAlt={tCommon('categoryAlt')}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </HomeFadeIn>
  );
}
