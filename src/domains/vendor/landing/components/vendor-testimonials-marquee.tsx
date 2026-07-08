'use client';

import { InfiniteMovingCards } from '@/components/card/infinite-moving-cards';
import { TESTIMONIALS } from '@/domains/vendor/landing/data/vendor-landing.data';

const testimonialItems = TESTIMONIALS.map((item) => ({
  quote: item.quote,
  name: item.name,
  title: item.business
}));

export function VendorTestimonialsMarquee() {
  return (
    <InfiniteMovingCards
      items={testimonialItems}
      direction='left'
      speed='slow'
      variant='testimonial'
      className='mt-10'
    />
  );
}
