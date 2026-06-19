import {
  FadeInView,
  FeatureCard,
  LandingContainer,
  SectionTitle
} from '@/domains/vendor/landing/components/ui/vendor-landing-primitives';
import { WHY_SELL_FEATURES } from '@/domains/vendor/landing/data/vendor-landing.data';

export function VendorWhySellSection() {
  return (
    <LandingContainer id='features' className='py-20 md:py-28'>
      <FadeInView>
        <SectionTitle
          eyebrow='Why sell with us'
          title='Everything you need to win on a modern marketplace'
          description='From discovery to payouts — one platform designed for sellers who care about craft and scale.'
        />
      </FadeInView>

      <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
        {WHY_SELL_FEATURES.map((feature, index) => (
          <FadeInView key={feature.title} delay={index * 0.05}>
            <FeatureCard
              icon={<feature.icon className='size-5' aria-hidden />}
              title={feature.title}
              description={feature.description}
              bullets={feature.bullets}
            />
          </FadeInView>
        ))}
      </div>
    </LandingContainer>
  );
}
