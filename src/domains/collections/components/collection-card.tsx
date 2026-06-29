'use client';

import { IconArrowRight, IconArrowUpRight } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { DtoHomeCollectionItem } from '~/src/services/-home-popular-collections-get.schemas';

interface CollectionCardProps {
  collection: DtoHomeCollectionItem;
  index: number;
}

export function CollectionCard({ collection, index }: CollectionCardProps) {
  const imageFirst = index % 2 === 0;
  const indexLabel = String(index + 1).padStart(2, '0');

  return (
    <motion.article
      id={collection.id?.toString() ?? ''}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, delay: 0.05 }}
      className='border-border/60 bg-card overflow-hidden rounded-[1.75rem] border shadow-sm sm:rounded-[2rem]'
    >
      <div className='grid lg:grid-cols-2'>
        <div
          className={cn(
            'group/image relative min-h-[18rem] overflow-hidden sm:min-h-[22rem] lg:min-h-[26rem]',
            !imageFirst && 'lg:order-2'
          )}
        >
          <Image
            src={collection.image_url ?? ''}
            alt={collection.title ?? ''}
            fill
            sizes='(max-width: 1024px) 100vw, 50vw'
            className='object-cover transition-transform duration-700 group-hover/image:scale-[1.04]'
          />
          <div className='from-foreground/70 via-foreground/15 absolute inset-0 bg-gradient-to-t to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-transparent' />
          <div className='from-foreground/80 absolute inset-0 bg-gradient-to-t via-transparent to-transparent lg:hidden' />

          <div className='absolute top-5 left-5 flex items-center gap-2 sm:top-6 sm:left-6'>
            <Badge
              variant='secondary'
              className='border-primary-foreground/15 bg-primary-foreground/10 text-primary-foreground rounded-full border px-3 py-1 text-[10px] font-semibold tracking-[0.18em] uppercase backdrop-blur-md'
            >
              {collection.eyebrow}
            </Badge>
          </div>

          <span className='text-primary-foreground/20 font-display pointer-events-none absolute right-5 bottom-3 text-7xl font-bold sm:text-8xl lg:hidden'>
            {indexLabel}
          </span>
        </div>

        <div
          className={cn(
            'relative flex flex-col justify-center px-6 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-14',
            !imageFirst && 'lg:order-1'
          )}
        >
          <div className='bg-gold/10 pointer-events-none absolute -top-16 right-0 h-40 w-40 rounded-full blur-3xl' />
          <div className='bg-accent/5 pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full blur-3xl' />

          <div className='relative'>
            <div className='mb-5 flex items-center gap-3'>
              <span className='text-muted-foreground font-display text-sm font-semibold tracking-[0.25em] uppercase'>
                Collection {indexLabel}
              </span>
              <span className='bg-border h-px flex-1' />
            </div>

            <h2 className='font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.05]'>
              {collection.title}
            </h2>
            <p className='text-muted-foreground mt-4 max-w-lg text-sm leading-relaxed sm:text-base'>
              {collection.description}
            </p>

            <div className='mt-8 flex flex-col gap-3 sm:flex-row sm:items-center'>
              <Link
                href={collection.href ?? ''}
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'bg-accent text-accent-foreground hover:bg-accent/90 h-12 rounded-full px-8 shadow-sm'
                )}
              >
                {collection.cta_label ?? 'Browse all pieces'}
                <IconArrowRight className='ml-2 size-4' />
              </Link>
              <Link
                href={collection.href ?? ''}
                className='text-foreground hover:text-accent inline-flex items-center gap-1.5 text-sm font-medium transition-colors'
              >
                Browse all pieces
                <IconArrowUpRight className='size-4' />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
