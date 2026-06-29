'use client';

import { IconQuote, IconStar } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

import { SectionCarousel } from '@/components/section-carousel';
import { Skeleton } from '@/components/ui/skeleton';
import type { Testimonial } from '~/src/domains/home/lib/home-mock-data';

import { useHomeContent } from '../hooks/use-home-content';

// ── Card ──────────────────────────────────────────────────────────────────────

function TestimonialCard({
  testimonial,
  index
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

      <div className='mt-4 flex gap-0.5'>
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

  return (
    <SectionCarousel
      sectionId='testimonials'
      eyebrow={t('testimonials.eyebrow')}
      title={t('testimonials.title')}
      description={t('testimonials.description')}
      items={testimonialItems}
      columns={{ mobile: 1, tablet: 2, desktop: 3 }}
      opts={{ align: 'start', loop: false, skipSnaps: false }}
      renderItem={(testimonial, index) => (
        <TestimonialCard
          testimonial={testimonial}
          index={index}
          starsLabel={t('common.starsRating', { rating: testimonial.rating })}
        />
      )}
      renderSkeleton={() => <Skeleton className='h-64 w-full rounded-2xl' />}
    />
  );
}
