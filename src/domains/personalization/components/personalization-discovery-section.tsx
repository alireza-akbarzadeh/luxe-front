'use client';

import { sectionContainerClass } from '@/domains/home/lib/home-utils';
import { PersonalizationFeaturesSection } from '~/src/domains/apps/components/personalization-features-section';

/** Homepage band — introduces mood, goal, and memory shopping before shoppers reach /apps. */
export function PersonalizationDiscoverySection() {
  return (
    <section id='personalized-shopping' className='py-8 sm:py-12 lg:py-16'>
      <div className={sectionContainerClass}>
        <PersonalizationFeaturesSection />
      </div>
    </section>
  );
}
