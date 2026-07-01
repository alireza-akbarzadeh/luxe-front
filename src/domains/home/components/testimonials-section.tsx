import { SectionCarousel } from '@/components/section-carousel';

import { getHomeContent } from '../lib/get-home-content';
import { TestimonialCard } from './ui/testimonial-card';

export async function TestimonialsSection() {
  const { testimonialItems, t } = await getHomeContent();

  return (
    <SectionCarousel
      sectionId='testimonials'
      eyebrow={t('testimonials.eyebrow')}
      title={t('testimonials.title')}
      description={t('testimonials.description')}
      columns={{ mobile: 1, tablet: 2, desktop: 3 }}
      opts={{ align: 'start', loop: false, skipSnaps: false }}
    >
      {testimonialItems.map((testimonial) => (
        <TestimonialCard key={testimonial.id} testimonial={testimonial} />
      ))}
    </SectionCarousel>
  );
}
