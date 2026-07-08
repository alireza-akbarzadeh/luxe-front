import type { ReactNode } from 'react';

import { BrandsSection } from '@/domains/home/components/brands-section';
import { HomeExperienceScrollSection } from '@/domains/home/components/home-experience-scroll-section';
import { MostWhitelists } from '@/domains/home/components/most-whitelists';
import { ProductStorySection } from '@/domains/home/components/product-story-section';
import {
  CardGridSkeleton,
  CarouselSkeleton,
  MarqueeSkeleton
} from '@/domains/home/components/ui/home-skeleton';
import { SectionBoundary } from '@/domains/home/components/ui/section-boundary';
import { LifestyleCollectionsSection } from '@/domains/lifestyle-collections/components/lifestyle-collections-section';
import { PersonalizationDiscoverySection } from '@/domains/personalization/components/personalization-discovery-section';
import { ShopTheLookSection } from '@/domains/shop-the-look/components/shop-the-look-section';

import { CategoriesSection } from './components/categories-section';
import { CollectionBanner } from './components/collection-banner';
import { FaqSection } from './components/faq-section';
import { FavoriteCategoriesSection } from './components/favorite-categories-section';
import { FeaturedProducts } from './components/featured-products';
import { FeaturesSection } from './components/features-section';
import { FinalCtaSection } from './components/final-cta-section';
import { HowItWorksSection } from './components/how-it-works-section';
import { MarketplaceShowcaseSection } from './components/marketplace-showcase-section';
import { NewArrivalsSection } from './components/new-arrivals-section';
import { NewsletterSection } from './components/newsletter-section';
import { PromoSection } from './components/promo-section';
import { RecentlyViewedHomeSection } from './components/recently-viewed-home-section';
import { RecommendedForYouSection } from './components/recommended-for-you-section';
import { StatsSection } from './components/stats-section';
import { TestimonialsSection } from './components/testimonials-section';

/** Wraps below-fold blocks — `content-visibility: auto` applies on mobile only (see globals.css). */
function MobileDeferredSection({ children }: { children: ReactNode }) {
  return <div className='home-defer-mobile'>{children}</div>;
}

/**
 * Luxury editorial order — trust → collections → categories → products → story →
 * features → cinematic banner → arrivals → social proof → lifestyle → conversion tail.
 */
export function HomeSections() {
  return (
    <>
      <MobileDeferredSection>
        <SectionBoundary fallback={<MarqueeSkeleton />}>
          <BrandsSection />
        </SectionBoundary>
      </MobileDeferredSection>

      <MobileDeferredSection>
        <SectionBoundary fallback={<CarouselSkeleton count={2} />}>
          <CollectionBanner />
        </SectionBoundary>
      </MobileDeferredSection>

      <MobileDeferredSection>
        <SectionBoundary fallback={<CardGridSkeleton count={8} />}>
          <CategoriesSection />
        </SectionBoundary>
      </MobileDeferredSection>

      <MobileDeferredSection>
        <SectionBoundary fallback={<CardGridSkeleton count={8} />}>
          <FeaturedProducts />
        </SectionBoundary>
      </MobileDeferredSection>

      <MobileDeferredSection>
        <ProductStorySection />
      </MobileDeferredSection>

      <MobileDeferredSection>
        <FeaturesSection />
      </MobileDeferredSection>

      <MobileDeferredSection>
        <HomeExperienceScrollSection />
      </MobileDeferredSection>

      <MobileDeferredSection>
        <SectionBoundary fallback={<CarouselSkeleton count={4} />}>
          <NewArrivalsSection />
        </SectionBoundary>
      </MobileDeferredSection>

      <MobileDeferredSection>
        <SectionBoundary fallback={<CardGridSkeleton count={12} />}>
          <MostWhitelists />
        </SectionBoundary>
      </MobileDeferredSection>

      <MobileDeferredSection>
        <SectionBoundary fallback={<CarouselSkeleton count={3} />}>
          <LifestyleCollectionsSection />
        </SectionBoundary>
      </MobileDeferredSection>

      <MobileDeferredSection>
        <TestimonialsSection />
      </MobileDeferredSection>

      <MobileDeferredSection>
        <StatsSection />
      </MobileDeferredSection>

      <MobileDeferredSection>
        <SectionBoundary fallback={null}>
          <PromoSection />
        </SectionBoundary>
      </MobileDeferredSection>

      <MobileDeferredSection>
        <MarketplaceShowcaseSection />
      </MobileDeferredSection>

      <MobileDeferredSection>
        <SectionBoundary fallback={<CarouselSkeleton count={2} />}>
          <ShopTheLookSection />
        </SectionBoundary>
      </MobileDeferredSection>

      <MobileDeferredSection>
        <FinalCtaSection />
      </MobileDeferredSection>

      <MobileDeferredSection>
        <SectionBoundary fallback={<CarouselSkeleton count={4} />}>
          <RecommendedForYouSection />
        </SectionBoundary>
      </MobileDeferredSection>

      <MobileDeferredSection>
        <SectionBoundary fallback={<CarouselSkeleton count={4} />}>
          <FavoriteCategoriesSection />
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
