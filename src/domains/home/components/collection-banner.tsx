'use client';

import { IconArrowRight } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { COLLECTION_BANNERS } from '../lib/home-mock-data';
import { sectionContainerClass } from '../lib/home-utils';

export function CollectionBanner() {
  return (
    <section className='py-16 sm:py-20 lg:py-28'>
      <div className={sectionContainerClass}>
        <div className='grid gap-4 sm:gap-5 lg:grid-cols-2 lg:gap-6'>
          {COLLECTION_BANNERS.map((banner, index) => (
            <motion.article
              key={banner.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className='group border-border/60 bg-card relative min-h-[22rem] overflow-hidden rounded-2xl border shadow-sm sm:min-h-[26rem] sm:rounded-3xl lg:min-h-[32rem]'
            >
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                sizes='(max-width: 1024px) 100vw, 50vw'
                className='object-cover transition-transform duration-700 group-hover:scale-[1.03]'
              />
              <div className='from-foreground/90 via-foreground/40 absolute inset-0 bg-gradient-to-t to-transparent' />

              <div className='absolute inset-0 flex flex-col justify-end p-6 sm:p-8 lg:p-10'>
                <span className='text-primary-foreground/75 text-xs font-semibold tracking-[0.2em] uppercase'>
                  {banner.eyebrow}
                </span>
                <h3 className='text-primary-foreground font-display mt-2 text-2xl font-semibold sm:text-3xl lg:text-4xl'>
                  {banner.title}
                </h3>
                <p className='text-primary-foreground/80 mt-2 max-w-md text-sm leading-relaxed sm:text-base'>
                  {banner.description}
                </p>
                <Link
                  href={banner.href}
                  className={cn(
                    buttonVariants({ variant: 'secondary', size: 'lg' }),
                    'mt-6 w-fit rounded-full bg-white/95 text-foreground hover:bg-white'
                  )}
                >
                  {banner.cta}
                  <IconArrowRight className='ml-2 h-4 w-4' />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
