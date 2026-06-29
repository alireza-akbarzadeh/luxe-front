'use client';

import { IconArrowRight } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { useGetHomeCategories } from '@/services/-home-categories-get';
import { FavoriteCategoriesSkeleton } from '~/src/domains/home/components/ui/favorite-Categories-Skeleton';
import { FavoriteCategoryItem } from '~/src/domains/home/components/ui/favorite-category-Item';

import { sectionContainerClass } from '../lib/home-utils';
import { SectionHeader } from './section-header';
import { HomeFadeIn } from './ui/home-fade-in';

const HOME_CATEGORY_LIMIT = 8;

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
