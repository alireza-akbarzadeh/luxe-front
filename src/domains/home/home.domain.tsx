import { Suspense } from 'react';

import { CardGridSkeleton, CarouselSkeleton } from '@/domains/home/components/ui/home-skeleton';

import { HeroSection } from './components/hero-section';
import { TrustBar } from './components/trust-bar';

function HomeBelowFoldFallback() {
  return (
    <>
      <CarouselSkeleton count={4} />
      <CardGridSkeleton count={8} />
    </>
  );
}

async function HomeBelowFoldDeferred() {
  const { HomeBelowFold } = await import('./home-below-fold.domain');
  return <HomeBelowFold />;
}

export function HomeDomains() {
  return (
    <div className='-mt-2 flex flex-col overflow-x-hidden sm:-mt-4'>
      <HeroSection />
      <Suspense fallback={null}>
        <TrustBar />
      </Suspense>
      <Suspense fallback={<HomeBelowFoldFallback />}>
        <HomeBelowFoldDeferred />
      </Suspense>
    </div>
  );
}
