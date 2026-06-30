import { BrandsSection } from '~/src/domains/home/components/brands-section';
import { MostWhitelists } from '~/src/domains/home/components/most-whitelists';
import {
  CardGridSkeleton,
  CarouselSkeleton,
  MarqueeSkeleton
} from '~/src/domains/home/components/ui/home-skeleton';
import { SectionBoundary } from '~/src/domains/home/components/ui/section-boundary';

import { BrandsMarquee } from './components/brands-marquee';
import { CategoriesSection } from './components/categories-section';
import { CollectionBanner } from './components/collection-banner';
import { FaqSection } from './components/faq-section';
import { FavoriteCategoriesSection } from './components/favorite-categories-section';
import { FeaturedProducts } from './components/featured-products';
import { FeaturesSection } from './components/features-section';
import { FinalCtaSection } from './components/final-cta-section';
import { HeroSection } from './components/hero-section';
import { HowItWorksSection } from './components/how-it-works-section';
import { MarketplaceShowcaseSection } from './components/marketplace-showcase-section';
import { NewArrivalsSection } from './components/new-arrivals-section';
import { NewsletterSection } from './components/newsletter-section';
import { PromoSection } from './components/promo-section';
import { StatsSection } from './components/stats-section';
import { TestimonialsSection } from './components/testimonials-section';
import { TrustBar } from './components/trust-bar';

export function HomeDomains() {
  return (
    <div className='-mt-2 flex flex-col overflow-x-hidden sm:-mt-4'>
      <HeroSection />

      <TrustBar />

      <SectionBoundary fallback={<CarouselSkeleton count={8} />}>
        <FavoriteCategoriesSection />
      </SectionBoundary>

      <PromoSection />

      <SectionBoundary fallback={<CardGridSkeleton count={8} />}>
        <FeaturedProducts />
      </SectionBoundary>

      <SectionBoundary fallback={<CardGridSkeleton count={8} />}>
        <MostWhitelists />
      </SectionBoundary>

      <SectionBoundary fallback={<CarouselSkeleton count={8} />}>
        <NewArrivalsSection />
      </SectionBoundary>

      <SectionBoundary fallback={<MarqueeSkeleton />}>
        <BrandsMarquee />
      </SectionBoundary>

      <SectionBoundary fallback={<CardGridSkeleton count={12} />}>
        <BrandsSection />
      </SectionBoundary>

      <SectionBoundary fallback={<CardGridSkeleton count={6} />}>
        <CategoriesSection />
      </SectionBoundary>

      <SectionBoundary fallback={<CarouselSkeleton count={2} />}>
        <CollectionBanner />
      </SectionBoundary>

      <MarketplaceShowcaseSection />
      <HowItWorksSection />
      <FeaturesSection />
      <TestimonialsSection />
      <StatsSection />
      <FaqSection />
      <FinalCtaSection />
      <NewsletterSection />
    </div>
  );
}
