'use client';

import { IconArrowRight } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import type { CuratedCollection } from '../lib/collections.config';

interface CollectionCardProps {
  collection: CuratedCollection;
  index: number;
}

export function CollectionCard({ collection, index }: CollectionCardProps) {
  return (
    <motion.article
      id={collection.id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className='group border-border/60 bg-card relative min-h-[22rem] overflow-hidden rounded-2xl border shadow-sm sm:min-h-[26rem] sm:rounded-3xl lg:min-h-[28rem]'
    >
      <Image
        src={collection.image}
        alt={collection.title}
        fill
        sizes='(max-width: 1024px) 100vw, 50vw'
        className='object-cover transition-transform duration-700 group-hover:scale-[1.03]'
      />
      <div className='from-foreground/90 via-foreground/40 absolute inset-0 bg-gradient-to-t to-transparent' />

      <div className='absolute inset-0 flex flex-col justify-end p-6 sm:p-8'>
        <span className='text-primary-foreground/75 text-xs font-semibold tracking-[0.2em] uppercase'>
          {collection.eyebrow}
        </span>
        <h2 className='text-primary-foreground font-display mt-2 text-2xl font-semibold sm:text-3xl'>
          {collection.title}
        </h2>
        <p className='text-primary-foreground/80 mt-2 max-w-md text-sm leading-relaxed sm:text-base'>
          {collection.description}
        </p>
        <Link
          href={collection.href}
          className={cn(
            buttonVariants({ variant: 'secondary', size: 'lg' }),
            'mt-6 w-fit rounded-full bg-white/95 text-foreground hover:bg-white'
          )}
        >
          {collection.cta}
          <IconArrowRight className='ml-2 h-4 w-4' />
        </Link>
      </div>
    </motion.article>
  );
}
