import { BrandsMarquee } from './components/brands-marquee';
import { CategoriesSection } from './components/categories-section';
import { CollectionBanner } from './components/collection-banner';
import { FaqSection } from './components/faq-section';
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

/**
 * Home landing narrative:
 * Hero → social proof → marketplace story → catalog → journey → collections → benefits →
 * social validation → stats → offer → FAQ → CTA → newsletter
 */
export function HomeDomains() {
  return (
    <div className='-mt-2 flex flex-col overflow-x-hidden sm:-mt-4'>
      <HeroSection />
      <TrustBar />
      <BrandsMarquee />
      <MarketplaceShowcaseSection />
      <CategoriesSection />
      <FeaturedProducts />
      <HowItWorksSection />
      <CollectionBanner />
      <NewArrivalsSection />
      <FeaturesSection />
      <TestimonialsSection />
      <StatsSection />
      <PromoSection />
      <FaqSection />
      <FinalCtaSection />
      <NewsletterSection />
    </div>
  );
}
