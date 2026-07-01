import { Suspense } from 'react';

import { CardGridSkeleton, CarouselSkeleton } from '@/domains/home/components/ui/home-skeleton';

import { HeroSection } from './components/hero-section';
import { TrustBar } from './components/trust-bar';
import { HomeBelowFold } from './home-below-fold.domain';

function HomeBelowFoldFallback() {
  return (
    <>
      <CarouselSkeleton count={4} />
      <CardGridSkeleton count={8} />
    </>
  );
}

export function HomeDomains() {
  return (
    <div className='-mt-2 flex flex-col overflow-x-hidden sm:-mt-4'>
      <HeroSection />
      <Suspense fallback={null}>
        <TrustBar />
      </Suspense>
      <Suspense fallback={<HomeBelowFoldFallback />}>
        <HomeBelowFold />
      </Suspense>
    </div>
  );
}
