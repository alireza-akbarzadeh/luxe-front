'use client';

import { IconQuote, IconStar } from '@tabler/icons-react';
import Image from 'next/image';

import type { Testimonial } from '@/domains/home/lib/home-mock-data';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

/** Client island for testimonial carousel cards (like/cart not needed — image + quote only). */
export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <blockquote className='group bg-card border-border/50 relative flex h-full flex-col rounded-2xl border p-6 shadow-sm transition-shadow duration-300 hover:shadow-md'>
      <span
        className='pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100'
        style={{
          background:
            'radial-gradient(ellipse at 60% 0%, rgba(201,169,110,0.07) 0%, transparent 70%)'
        }}
        aria-hidden
      />

      <IconQuote className='text-accent/30 h-7 w-7 shrink-0' aria-hidden />

      <div className='mt-4 flex gap-0.5' aria-hidden>
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <IconStar key={i} className='fill-accent text-accent h-4 w-4' />
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
    </blockquote>
  );
}
