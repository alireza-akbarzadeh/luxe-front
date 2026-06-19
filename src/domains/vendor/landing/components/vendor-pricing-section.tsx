import {
  FadeInView,
  LandingContainer,
  PricingCard,
  SectionTitle
} from '@/domains/vendor/landing/components/ui/vendor-landing-primitives';
import { PRICING_PLANS } from '@/domains/vendor/landing/data/vendor-landing.data';

export function VendorPricingSection() {
  return (
    <LandingContainer id='pricing' className='py-20 md:py-28'>
      <FadeInView>
        <SectionTitle
          eyebrow='Pricing'
          title='Plans that grow with your business'
          description='Transparent commissions. No surprises. Upgrade when you are ready to scale.'
        />
      </FadeInView>

      <div className='grid gap-6 lg:grid-cols-3 lg:gap-8'>
        {PRICING_PLANS.map((plan, index) => (
          <FadeInView key={plan.id} delay={index * 0.08}>
            <PricingCard
              {...plan}
              href={
                plan.id === 'enterprise'
                  ? '/contact'
                  : '/register?callbackUrl=/vendor/panel'
              }
            />
          </FadeInView>
        ))}
      </div>
    </LandingContainer>
  );
}
