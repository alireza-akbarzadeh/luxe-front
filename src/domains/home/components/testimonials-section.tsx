'use client';

import { IconQuote, IconStar } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { ChevronButton } from '~/src/components/section-carousel/chevron-button';
import { DotIndicators } from '~/src/components/section-carousel/dot-Indicators';
import type { Testimonial } from '~/src/domains/home/lib/home-mock-data';
import { useCarouselState } from '~/src/hooks/useCarouselState';

import { useHomeContent } from '../hooks/use-home-content';
import { sectionContainerClass } from '../lib/home-utils';
import { SectionHeader } from './section-header';

// ── Single card ───────────────────────────────────────────────────────────────
function TestimonialCard({
  testimonial,
  index,
  starsLabel
}: {
  testimonial: Testimonial;
  index: number;
  starsLabel: string;
}) {
  return (
    <motion.blockquote
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      className='group bg-card border-border/50 relative flex h-full flex-col rounded-2xl border p-6 shadow-sm transition-shadow duration-300 hover:shadow-md'
    >
      <span
        className='pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100'
        style={{
          background:
            'radial-gradient(ellipse at 60% 0%, rgba(201,169,110,0.07) 0%, transparent 70%)'
        }}
        aria-hidden
      />

      <IconQuote className='text-accent/30 h-7 w-7 shrink-0' aria-hidden />

      <div className='mt-4 flex gap-0.5' aria-label={starsLabel}>
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0.4 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25, delay: index * 0.07 + i * 0.05 }}
          >
            <IconStar className='fill-accent text-accent h-4 w-4' />
          </motion.span>
        ))}
      </div>

      <p className='text-muted-foreground mt-4 flex-1 text-sm leading-relaxed sm:text-[15px]'>
        &ldquo;{testimonial.content}&rdquo;
      </p>

      <footer className='border-border/40 mt-6 flex items-center gap-3 border-t pt-5'>
        <div className='ring-border/40 relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1'>
          <Image src={testimonial.avatar} alt={testimonial.name} fill className='object-cover' />
        </div>
        <div>
          <cite className='text-sm font-semibold not-italic'>{testimonial.name}</cite>
          <p className='text-muted-foreground text-xs'>{testimonial.role}</p>
        </div>
      </footer>
    </motion.blockquote>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────
export function TestimonialsSection() {
  const { testimonialItems, t } = useHomeContent();
  const { setApi, current, count, scrollTo, scrollPrev, scrollNext, canScrollPrev, canScrollNext } =
    useCarouselState();

  return (
    <section id='testimonials' className='py-16 sm:py-20 lg:py-28'>
      <div className={sectionContainerClass}>
        {/* Header row — desktop chevrons sit flush right of the header */}
        <div className='mb-8 flex items-end justify-between md:mb-10'>
          <SectionHeader
            eyebrow={t('testimonials.eyebrow')}
            title={t('testimonials.title')}
            description={t('testimonials.description')}
            className='mb-0'
          />
          <div className='hidden shrink-0 items-center gap-2 pb-1 lg:flex'>
            <ChevronButton direction='prev' onClick={scrollPrev} disabled={!canScrollPrev} />
            <ChevronButton direction='next' onClick={scrollNext} disabled={!canScrollNext} />
          </div>
        </div>

        {/* Single carousel — basis changes per breakpoint */}
        <Carousel
          setApi={setApi}
          opts={{ align: 'start', loop: true, skipSnaps: false }}
          className='w-full'
        >
          <CarouselContent className='-ml-4'>
            {testimonialItems.map((testimonial, index) => (
              <CarouselItem
                key={testimonial.id}
                className='basis-[88%] pl-4 sm:basis-[70%] lg:basis-1/3'
              >
                <TestimonialCard
                  testimonial={testimonial}
                  index={index}
                  starsLabel={t('common.starsRating', { rating: testimonial.rating })}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Bottom row: mobile chevrons (left) + dots (centre) + invisible spacer (right) */}
        <div className='mt-6 flex items-center justify-between lg:justify-center'>
          <div className='flex items-center gap-2 lg:hidden'>
            <ChevronButton direction='prev' onClick={scrollPrev} disabled={!canScrollPrev} />
            <ChevronButton direction='next' onClick={scrollNext} disabled={!canScrollNext} />
          </div>

          <DotIndicators count={count} active={current} onDotClick={scrollTo} />

          {/* Mirror spacer keeps dots visually centred on mobile */}
          <div className='flex gap-2 opacity-0 lg:hidden' aria-hidden>
            <div className='size-9' />
            <div className='size-9' />
          </div>
        </div>
      </div>
    </section>
  );
}
