import { BrandsMarquee } from './components/brands-marquee';
import { CategoriesSection } from './components/categories-section';
import { CollectionBanner } from './components/collection-banner';
import { FeaturedProducts } from './components/featured-products';
import { FeaturesSection } from './components/features-section';
import { HeroSection } from './components/hero-section';
import { NewArrivalsSection } from './components/new-arrivals-section';
import { NewsletterSection } from './components/newsletter-section';
import { PromoSection } from './components/promo-section';
import { TestimonialsSection } from './components/testimonials-section';
import { TrustBar } from './components/trust-bar';

export function HomeDomains() {
  return (
    <div className='-mt-2 flex flex-col overflow-x-hidden sm:-mt-4'>
      <HeroSection />
      <TrustBar />
      <CategoriesSection />
      <FeaturedProducts />
      <CollectionBanner />
      <NewArrivalsSection />
      <PromoSection />
      <FeaturesSection />
      <TestimonialsSection />
      <BrandsMarquee />
      <NewsletterSection />
    </div>
  );
}
