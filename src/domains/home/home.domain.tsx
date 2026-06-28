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

/**
 * Home landing narrative (top → bottom):
 *
 * 1. Hook — Hero + trust strip
 * 2. Personalize — Favorite categories (quick paths)
 * 3. Convert — Flash promo, featured grids, new arrivals
 * 4. Discover — Brands, category browse, editorial collections
 * 5. Explain — Marketplace story, how it works, feature benefits
 * 6. Validate — Testimonials + platform stats
 * 7. Close — FAQ, final CTA, newsletter
 */
export function HomeDomains() {
  return (
    <div className='-mt-2 flex flex-col overflow-x-hidden sm:-mt-4'>
      <HeroSection />
      <TrustBar />
      <FavoriteCategoriesSection />
      <PromoSection />
      <FeaturedProducts />
      <NewArrivalsSection />
      <BrandsMarquee />
      <CategoriesSection />
      <CollectionBanner />
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
