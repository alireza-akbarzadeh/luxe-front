'use client';

import { IconArrowRight } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import { Skeleton } from '@/components/ui/skeleton';
import { useGetCategories } from '~/src/services/-categories-get';

import { useHomeContent } from '../hooks/use-home-content';
import { getCategoryImage, resolveCategories, sectionContainerClass } from '../lib/home-utils';
import { SectionHeader } from './section-header';

export function CategoriesSection() {
  const { mockCategories, t } = useHomeContent();
  const { data, isLoading, isError } = useGetCategories({
    is_active: true,
    limit: 8,
    offset: 0
  });

  const apiCategories = resolveCategories(data?.data?.categories);
  const usingMock = isError || !apiCategories.length;
  const categories = usingMock ? mockCategories : apiCategories;

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

        {usingMock && !isLoading && (
          <p className='text-muted-foreground -mt-6 mb-6 text-sm sm:mb-8'>
            {t('common.categoriesMockNotice')}
          </p>
        )}

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
                  image={getCategoryImage(category, index)}
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
                    image={getCategoryImage(category, index)}
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

function CategoryCard({
  name,
  description,
  categoryId,
  image,
  shopNowLabel,
  categoryAlt,
  className
}: Readonly<{
  name?: string;
  description?: string;
  categoryId?: number;
  image: string;
  shopNowLabel: string;
  categoryAlt: string;
  className?: string;
}>) {
  const href = categoryId ? `/shop?categoryId=${categoryId}` : '/shop';

  return (
    <Link
      href={href}
      className={`group relative block aspect-3/4 overflow-hidden rounded-2xl shadow-md sm:rounded-3xl ${className ?? ''}`}
    >
      <Image
        src={image}
        alt={name ?? categoryAlt}
        fill
        sizes='(max-width: 640px) 75vw, 25vw'
        className='object-cover transition-transform duration-700 group-hover:scale-105'
      />
      <div className='from-foreground/85 via-foreground/25 absolute inset-0 bg-gradient-to-t to-transparent' />
      <div className='absolute right-0 bottom-0 left-0 p-5 sm:p-6'>
        <h3 className='text-primary-foreground font-display text-xl font-semibold sm:text-2xl'>
          {name}
        </h3>
        {description != null && (
          <p className='text-primary-foreground/75 mt-1 line-clamp-2 text-sm'>{description}</p>
        )}
        <span className='text-primary-foreground mt-4 inline-flex items-center gap-2 text-sm font-medium'>
          {shopNowLabel}
          <IconArrowRight className='cn-rtl-flip h-4 w-4 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5' />
        </span>
      </div>
    </Link>
  );
}
