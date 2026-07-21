import { BrandsSection } from '@/domains/home/components/brands-section';
import { MostWhitelists } from '@/domains/home/components/most-whitelists';
import { CarouselSkeleton, MarqueeSkeleton } from '@/domains/home/components/ui/home-skeleton';
import { SectionBoundary } from '@/domains/home/components/ui/section-boundary';
import { LifestyleCollectionsSection } from '@/domains/lifestyle-collections/components/lifestyle-collections-section';
import { PersonalizationDiscoverySection } from '@/domains/personalization/components/personalization-discovery-section';
import { ShopTheLookSection } from '@/domains/shop-the-look/components/shop-the-look-section';
import { MobileDeferredSection } from '~/src/domains/home/components/mobile-deffred-section';

import { CollectionBanner } from './components/collection-banner';
import { FaqSection } from './components/faq-section';
import { FavoriteCategoriesSection } from './components/favorite-categories-section';
import { FeaturedProducts } from './components/featured-products';
import { FeaturesSection } from './components/features-section';
import { HowItWorksSection } from './components/how-it-works-section';
import { MarketingBandsSection } from './components/marketing-bands-section';
import { NewArrivalsSection } from './components/new-arrivals-section';
import { NewsletterSection } from './components/newsletter-section';
import { RecentlyViewedHomeSection } from './components/recently-viewed-home-section';
import { RecommendedForYouSection } from './components/recommended-for-you-section';
import { SeasonalPicksSection } from './components/seasonal-picks-section';
import { TestimonialsSection } from './components/testimonials-section';

/**
 * Dense storefront home order — stories → flash deals → products → dual promos →
 * why-us → secondary rails → conversion tail.
 */
export function HomeSections() {
  return (
    <>
      <MobileDeferredSection>
        <SectionBoundary fallback={<CarouselSkeleton count={8} />}>
          <FavoriteCategoriesSection />
        </SectionBoundary>
      </MobileDeferredSection>

      <MobileDeferredSection>
        <SectionBoundary fallback={null}>
          <MarketingBandsSection />
        </SectionBoundary>
      </MobileDeferredSection>

      <MobileDeferredSection>
        <SectionBoundary
          fallback={
            <CarouselSkeleton
              count={5}
              columns={{ mobile: 2, tablet: 3, desktop: 5 }}
              aspect='aspect-4/5'
            />
          }
        >
          <FeaturedProducts />
        </SectionBoundary>
      </MobileDeferredSection>

      <MobileDeferredSection>
        <SectionBoundary
          fallback={
            <CarouselSkeleton
              count={2}
              columns={{ mobile: 1, tablet: 2, desktop: 2 }}
              aspect='aspect-[1.6]'
            />
          }
        >
          <CollectionBanner />
        </SectionBoundary>
      </MobileDeferredSection>

      <MobileDeferredSection>
        <FeaturesSection />
      </MobileDeferredSection>

      <MobileDeferredSection>
        <SectionBoundary
          fallback={<CarouselSkeleton count={3} columns={{ mobile: 2, tablet: 2, desktop: 3 }} />}
        >
          <SeasonalPicksSection />
        </SectionBoundary>
      </MobileDeferredSection>

      <MobileDeferredSection>
        <SectionBoundary fallback={<CarouselSkeleton count={5} />}>
          <NewArrivalsSection />
        </SectionBoundary>
      </MobileDeferredSection>

      <MobileDeferredSection>
        <SectionBoundary
          fallback={
            <CarouselSkeleton
              count={5}
              columns={{ mobile: 2, tablet: 3, desktop: 5 }}
              aspect='aspect-4/5'
            />
          }
        >
          <MostWhitelists />
        </SectionBoundary>
      </MobileDeferredSection>

      <SectionBoundary fallback={<MarqueeSkeleton />}>
        <BrandsSection />
      </SectionBoundary>

      <MobileDeferredSection>
        <SectionBoundary fallback={<CarouselSkeleton count={3} />}>
          <LifestyleCollectionsSection />
        </SectionBoundary>
      </MobileDeferredSection>

      <MobileDeferredSection>
        <TestimonialsSection />
      </MobileDeferredSection>

      <MobileDeferredSection>
        <SectionBoundary fallback={<CarouselSkeleton count={2} />}>
          <ShopTheLookSection />
        </SectionBoundary>
      </MobileDeferredSection>

      <MobileDeferredSection>
        <SectionBoundary fallback={<CarouselSkeleton count={4} />}>
          <RecommendedForYouSection />
        </SectionBoundary>
      </MobileDeferredSection>

      <MobileDeferredSection>
        <SectionBoundary fallback={null}>
          <PersonalizationDiscoverySection />
        </SectionBoundary>
      </MobileDeferredSection>

      <MobileDeferredSection>
        <SectionBoundary fallback={<CarouselSkeleton count={4} />}>
          <RecentlyViewedHomeSection />
        </SectionBoundary>
      </MobileDeferredSection>

      <MobileDeferredSection>
        <HowItWorksSection />
      </MobileDeferredSection>

      <MobileDeferredSection>
        <FaqSection />
      </MobileDeferredSection>

      <MobileDeferredSection>
        <NewsletterSection />
      </MobileDeferredSection>
    </>
  );
}
