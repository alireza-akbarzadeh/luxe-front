'use client';

import { useTranslations } from 'next-intl';
import { Suspense } from 'react';

import { Box } from '@/components/ui/box';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/typography';
import { PlusComparisonSection } from '@/domains/plus/components/plus-comparison-section';
import { PlusFaqSection } from '@/domains/plus/components/plus-faq-section';
import { PlusFinalCtaSection } from '@/domains/plus/components/plus-final-cta-section';
import { PlusHeroSection } from '@/domains/plus/components/plus-hero-section';
import { PlusHowItWorksSection } from '@/domains/plus/components/plus-how-it-works-section';
import { PlusPricingSection } from '@/domains/plus/components/plus-pricing-section';
import { PlusSavingsSection } from '@/domains/plus/components/plus-savings-section';
import { PlusStatsSection } from '@/domains/plus/components/plus-stats-section';
import { PlusSubscribeCallback } from '@/domains/plus/components/plus-subscribe-callback';
import { PlusTestimonialsSection } from '@/domains/plus/components/plus-testimonials-section';
import { usePlusBenefitsQuery } from '@/domains/plus/hooks/use-plus-membership';

function PlusLandingSkeleton() {
  return (
    <Box className='app-container space-y-8 py-16'>
      <Skeleton className='h-12 w-2/3 max-w-lg rounded-xl' />
      <Skeleton className='h-6 w-full max-w-xl rounded-lg' />
      <Skeleton className='h-80 rounded-3xl' />
      <Skeleton className='h-48 rounded-3xl' />
    </Box>
  );
}

function PlusLandingContent() {
  const t = useTranslations('plus.landing');
  const { data, isLoading, isError } = usePlusBenefitsQuery();
  const benefits = data?.data;

  if (isLoading) {
    return <PlusLandingSkeleton />;
  }

  if (isError || !benefits) {
    return (
      <Box className='app-container py-24 text-center'>
        <Text className='text-destructive'>{t('loadError')}</Text>
      </Box>
    );
  }

  return (
    <>
      <PlusHeroSection benefits={benefits} />
      <PlusStatsSection benefits={benefits} />
      <PlusComparisonSection benefits={benefits} />
      <PlusSavingsSection benefits={benefits} />
      <PlusHowItWorksSection />
      <PlusTestimonialsSection />
      <PlusPricingSection benefits={benefits} />
      <PlusFaqSection />
      <PlusFinalCtaSection />
    </>
  );
}

export function PlusLandingDomain() {
  return (
    <Box className='bg-background relative min-h-svh overflow-hidden'>
      <Suspense fallback={null}>
        <PlusSubscribeCallback />
      </Suspense>
      <main>
        <PlusLandingContent />
      </main>
    </Box>
  );
}
