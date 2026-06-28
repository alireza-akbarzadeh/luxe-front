'use client';

import { IconArrowRight } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useGetHomePopularCollections } from '@/services/-home-popular-collections-get';

import { useHomeContent } from '../hooks/use-home-content';
import { sectionContainerClass } from '../lib/home-utils';

const COLLECTION_LIMIT = 2;

export function CollectionBanner() {
  const { t } = useHomeContent();
  const { data, isLoading, isError } = useGetHomePopularCollections({ limit: COLLECTION_LIMIT });

  const collections = data?.data?.collections ?? [];

  if (!isLoading && (isError || collections.length === 0)) {
    return null;
  }

  return (
    <section className='py-16 sm:py-20 lg:py-28'>
      <div className={sectionContainerClass}>
        <div className='mb-8 flex flex-wrap items-end justify-between gap-4'>
          <div>
            <p className='text-accent text-xs font-semibold tracking-[0.2em] uppercase'>
              {t('collections.eyebrow')}
            </p>
            <h2 className='font-display mt-2 text-3xl font-semibold tracking-tight sm:text-4xl'>
              {t('collections.title')}
            </h2>
          </div>
          <Link
            href='/collections'
            className='text-accent inline-flex items-center gap-1 text-sm font-medium hover:underline'
          >
            {t('collections.viewAll')}
            <IconArrowRight className='cn-rtl-flip h-4 w-4' />
          </Link>
        </div>

        {isLoading ? (
          <div className='grid gap-4 sm:gap-5 lg:grid-cols-2 lg:gap-6'>
            {Array.from({ length: COLLECTION_LIMIT }).map((_, index) => (
              <Skeleton
                key={index}
                className='min-h-[22rem] rounded-2xl sm:min-h-[26rem] sm:rounded-3xl lg:min-h-[32rem]'
              />
            ))}
          </div>
        ) : (
          <div className='grid gap-4 sm:gap-5 lg:grid-cols-2 lg:gap-6'>
            {collections.map((banner, index) => {
              const href =
                banner.href ?? (banner.slug ? `/collections/${banner.slug}` : '/collections');
              const image = banner.image_url;

              return (
                <motion.article
                  key={banner.id ?? index}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className='group border-border/60 bg-card relative min-h-[22rem] overflow-hidden rounded-2xl border shadow-sm sm:min-h-[26rem] sm:rounded-3xl lg:min-h-[32rem]'
                >
                  {image ? (
                    <Image
                      src={image}
                      alt={banner.title ?? t('collections.title')}
                      fill
                      sizes='(max-width: 1024px) 100vw, 50vw'
                      className='object-cover transition-transform duration-700 group-hover:scale-[1.03]'
                    />
                  ) : (
                    <div className='bg-muted absolute inset-0' />
                  )}
                  <div className='from-foreground/90 via-foreground/40 absolute inset-0 bg-gradient-to-t to-transparent' />

                  <div className='absolute inset-0 flex flex-col justify-end p-6 sm:p-8 lg:p-10'>
                    {banner.eyebrow ? (
                      <span className='text-primary-foreground/75 text-xs font-semibold tracking-[0.2em] uppercase'>
                        {banner.eyebrow}
                      </span>
                    ) : null}
                    <h3 className='text-primary-foreground font-display mt-2 text-2xl font-semibold sm:text-3xl lg:text-4xl'>
                      {banner.title}
                    </h3>
                    {banner.description ? (
                      <p className='text-primary-foreground/80 mt-2 max-w-md text-sm leading-relaxed sm:text-base'>
                        {banner.description}
                      </p>
                    ) : null}
                    <Link
                      href={href}
                      className={cn(
                        buttonVariants({ variant: 'secondary', size: 'lg' }),
                        'text-foreground mt-6 w-fit rounded-full bg-white/95 hover:bg-white'
                      )}
                    >
                      {banner.cta_label ?? t('collections.viewAll')}
                      <IconArrowRight className='cn-rtl-flip ms-2 h-4 w-4' />
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
