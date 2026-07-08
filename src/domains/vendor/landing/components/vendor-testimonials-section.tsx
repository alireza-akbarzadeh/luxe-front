import {
  FadeInView,
  LandingContainer,
  SectionTitle,
  TestimonialCard
} from '@/domains/vendor/landing/components/ui/vendor-landing-primitives';
import { VendorTestimonialsMarquee } from '@/domains/vendor/landing/components/vendor-testimonials-marquee';
import { TESTIMONIALS } from '@/domains/vendor/landing/data/vendor-landing.data';

export function VendorTestimonialsSection() {
  return (
    <LandingContainer id='success-stories' className='py-20 md:py-28'>
      <FadeInView>
        <SectionTitle
          eyebrow='Success stories'
          title='Sellers who scaled with Luxe'
          description='Real brands. Real growth. Hear from vendors who made the leap.'
        />
      </FadeInView>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {TESTIMONIALS.map((testimonial, index) => (
          <FadeInView key={testimonial.name} delay={index * 0.08}>
            <TestimonialCard {...testimonial} />
          </FadeInView>
        ))}
      </div>

      <VendorTestimonialsMarquee />
    </LandingContainer>
  );
}
