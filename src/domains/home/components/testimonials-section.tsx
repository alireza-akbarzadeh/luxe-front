'use client';

import { IconQuote, IconStar } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

import { testimonials } from '../lib/home-mock-data';
import { sectionContainerClass } from '../lib/home-utils';
import { SectionHeader } from './section-header';

export function TestimonialsSection() {
  return (
    <section id='testimonials' className='bg-secondary/30 py-16 sm:py-20 lg:py-28'>
      <div className={sectionContainerClass}>
        <SectionHeader
          eyebrow='Customer stories'
          title='Loved by thousands'
          description='Real reviews from shoppers who value craftsmanship, service, and a seamless experience.'
        />

        <div className='custom-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:grid-cols-2 lg:gap-5 lg:overflow-visible lg:px-0 xl:grid-cols-4'>
          {testimonials.map((testimonial, index) => (
            <motion.blockquote
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className='bg-card border-border/60 w-[85vw] shrink-0 snap-start rounded-2xl border p-6 shadow-sm sm:w-[70vw] md:w-[45vw] lg:w-auto'
            >
              <IconQuote className='text-muted-foreground/25 h-8 w-8' aria-hidden />
              <div className='mt-4 flex gap-0.5' aria-label={`${testimonial.rating} out of 5 stars`}>
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <IconStar key={i} className='fill-accent text-accent h-4 w-4' />
                ))}
              </div>
              <p className='text-muted-foreground mt-4 text-sm leading-relaxed sm:text-base'>
                &ldquo;{testimonial.content}&rdquo;
              </p>
              <footer className='mt-6 flex items-center gap-3 border-t border-border/50 pt-5'>
                <div className='relative h-11 w-11 overflow-hidden rounded-full'>
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    className='object-cover'
                  />
                </div>
                <div>
                  <cite className='text-sm font-semibold not-italic'>{testimonial.name}</cite>
                  <p className='text-muted-foreground text-xs'>{testimonial.role}</p>
                </div>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
