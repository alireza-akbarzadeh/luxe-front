'use client';

import { useTranslations } from 'next-intl';

import {
  AnimatedStat,
  FadeInView,
  LandingContainer,
  SectionTitle
} from '@/domains/vendor/landing/components/ui/vendor-landing-primitives';
import { PLATFORM_STATS } from '@/domains/vendor/landing/data/vendor-landing.data';
import { useVendorLandingContent } from '@/domains/vendor/landing/hooks/use-vendor-landing-content';

export function VendorStatisticsSection() {
  const t = useTranslations('vendor.landing.statistics');
  const { platformStats } = useVendorLandingContent();

  return (
    <LandingContainer className='py-20 md:py-28'>
      <div className='border-border/50 from-gold/5 via-card/40 to-card/20 rounded-[2rem] border bg-gradient-to-b px-6 py-16 md:px-12 md:py-20'>
        <FadeInView>
          <SectionTitle
            eyebrow={t('eyebrow')}
            title={t('title')}
            description={t('subtitle')}
            className='mb-12'
          />
        </FadeInView>

        <div className='grid gap-10 sm:grid-cols-2 lg:grid-cols-3'>
          {PLATFORM_STATS.map((stat, index) => (
            <FadeInView key={stat.id} delay={index * 0.05}>
              <AnimatedStat
                value={stat.value}
                suffix={stat.suffix}
                label={platformStats[index]?.label ?? stat.label}
                decimals={'decimals' in stat ? stat.decimals : 0}
              />
            </FadeInView>
          ))}
        </div>
      </div>
    </LandingContainer>
  );
}
