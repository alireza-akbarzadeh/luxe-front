import {
  FadeInView,
  LandingContainer,
  SectionTitle
} from '@/domains/vendor/landing/components/ui/vendor-landing-primitives';
import { TRUST_STATS, TRUSTED_BRANDS } from '@/domains/vendor/landing/data/vendor-landing.data';

export function VendorLogoCloudSection() {
  return (
    <LandingContainer className='border-border/40 border-y py-16 md:py-20'>
      <FadeInView>
        <SectionTitle
          eyebrow='Trusted by'
          title='Brands scaling on Luxe'
          description='Join thousands of sellers who trust our platform to power their growth.'
          align='center'
          className='mb-10'
        />
      </FadeInView>

      <FadeInView delay={0.1}>
        <ul
          className='mx-auto grid max-w-4xl grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4'
          aria-label='Partner brands'
        >
          {TRUSTED_BRANDS.map((brand) => (
            <li
              key={brand}
              className='text-muted-foreground flex items-center justify-center text-sm font-semibold tracking-wide uppercase opacity-70 transition-opacity hover:opacity-100'
            >
              {brand}
            </li>
          ))}
        </ul>
      </FadeInView>

      <FadeInView delay={0.15}>
        <dl className='mt-14 grid gap-8 sm:grid-cols-3'>
          {TRUST_STATS.map((stat) => (
            <div key={stat.label} className='text-center'>
              <dt className='text-2xl font-semibold tracking-tight md:text-3xl'>{stat.value}</dt>
              <dd className='text-muted-foreground mt-1 text-sm'>{stat.label}</dd>
            </div>
          ))}
        </dl>
      </FadeInView>
    </LandingContainer>
  );
}
