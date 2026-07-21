import { Hero } from '@/domains/home/components/hero';
import { TrustBar } from '@/domains/home/components/trust-bar';
import { CardGridSkeleton, CarouselSkeleton } from '@/domains/home/components/ui/home-skeleton';

import { HomeSections } from './home-sections';

export function HomeDomains() {
  return (
    <div className='flex flex-col overflow-x-hidden'>
      <Hero />
      <TrustBar />
      <HomeSections />
    </div>
  );
}

/** Reserved for a future route-level `loading.tsx` export if needed. */
export function HomeBelowFoldFallback() {
  return (
    <>
      <CarouselSkeleton count={4} />
      <CardGridSkeleton count={8} />
    </>
  );
}
