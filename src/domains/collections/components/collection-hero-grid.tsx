'use client';

import { IconArrowUpRight } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

import { AppImage } from '@/components/ui/app-image';
import { IMAGE_FALLBACK } from '@/lib/images';
import { cn } from '@/lib/utils';
import type { DtoCollectionResponse } from '@/services/-collections-get.schemas';

interface CollectionHeroGridProps {
  collections: DtoCollectionResponse[];
}

export function CollectionHeroGrid({ collections }: CollectionHeroGridProps) {
  return (
    <div className='mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:grid-rows-2 lg:gap-5'>
      {collections.map((collection, index) => {
        const isFeatured = index === 0;

        return (
          <motion.div
            key={collection.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, delay: index * 0.06 }}
            className={cn(isFeatured && 'col-span-2 row-span-2 lg:col-span-2 lg:row-span-2')}
          >
            <Link
              href={`/collections/${collection.slug ?? ''}`}
              className={cn(
                'group border-border/60 bg-card relative block overflow-hidden rounded-2xl border shadow-sm sm:rounded-3xl',
                isFeatured
                  ? 'aspect-[4/5] sm:aspect-[16/11] lg:aspect-auto lg:min-h-full'
                  : 'aspect-[4/5]'
              )}
            >
              <AppImage
                src={collection.desktop_image_url || collection.image_url || IMAGE_FALLBACK}
                alt={collection.title ?? ''}
                fill
                sizes={
                  isFeatured ? '(max-width: 1024px) 100vw, 50vw' : '(max-width: 640px) 50vw, 25vw'
                }
                className='object-cover transition-transform duration-700 group-hover:scale-105'
              />
              <div className='from-foreground/85 via-foreground/30 absolute inset-0 bg-gradient-to-t to-transparent' />

              <div className='absolute inset-0 flex flex-col justify-between p-4 sm:p-5 lg:p-6'>
                <div className='flex items-start justify-between gap-3'>
                  <span className='border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] uppercase backdrop-blur-sm'>
                    {collection.eyebrow}
                  </span>
                  <span className='text-primary-foreground/30 font-display text-3xl font-semibold tabular-nums sm:text-4xl'>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <div>
                  <h2
                    className={cn(
                      'text-primary-foreground font-display font-semibold tracking-tight',
                      isFeatured ? 'text-2xl sm:text-3xl lg:text-4xl' : 'text-lg sm:text-xl'
                    )}
                  >
                    {collection.title}
                  </h2>
                  {isFeatured ? (
                    <p className='text-primary-foreground/75 mt-2 line-clamp-2 max-w-md text-sm leading-relaxed'>
                      {collection.description}
                    </p>
                  ) : null}
                  <span className='text-primary-foreground mt-3 inline-flex items-center gap-1.5 text-sm font-medium'>
                    Explore
                    <IconArrowUpRight className='size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
